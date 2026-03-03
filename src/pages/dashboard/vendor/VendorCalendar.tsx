import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CalendarX, Plus, Trash2 } from "lucide-react";

const VendorCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ property_id: "", start_date: "", end_date: "", reason: "" });

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    const { data: props } = await supabase.from("properties").select("id, title").eq("landlord_id", user.id);
    setProperties(props || []);
    const { data: blocked } = await supabase.from("blocked_dates").select("*, properties(title)").eq("vendor_id", v.id).order("start_date");
    setBlockedDates(blocked || []);
    const { data: bks } = await supabase.from("accommodation_bookings").select("*, properties(title)").eq("vendor_id", v.id).in("status", ["confirmed", "pending"]).order("check_in");
    setBookings(bks || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    const { error } = await supabase.from("blocked_dates").insert({ ...form, vendor_id: vendor.id });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Dates blocked" });
    setDialogOpen(false);
    fetchData();
  };

  const removeBlock = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    toast({ title: "Block removed" });
    fetchData();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Availability Calendar</h2>
          <p className="text-muted-foreground">Manage blocked dates and view bookings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Block Dates</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Block Dates</DialogTitle></DialogHeader>
            <form onSubmit={handleBlock} className="space-y-4">
              <div className="space-y-2">
                <Label>Property *</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Reason</Label><Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Maintenance" /></div>
              <Button type="submit" className="w-full">Block Dates</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-lg">Blocked Dates</CardTitle></CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No blocked dates.</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((bd) => (
                  <div key={bd.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{(bd as any).properties?.title}</p>
                      <p className="text-xs text-muted-foreground">{bd.start_date} → {bd.end_date} {bd.reason && `· ${bd.reason}`}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBlock(bd.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display text-lg">Upcoming Bookings</CardTitle></CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No upcoming bookings.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.guest_name}</p>
                      <p className="text-xs text-muted-foreground">{(b as any).properties?.title} · {b.check_in} → {b.check_out}</p>
                    </div>
                    <Badge className={b.status === "confirmed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}>{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorCalendar;
