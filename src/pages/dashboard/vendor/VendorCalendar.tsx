import { useEffect, useState, useMemo } from "react";
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
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isToday, isSameDay, isWithinInterval, parseISO } from "date-fns";

const VendorCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ property_id: "", start_date: "", end_date: "", reason: "" });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");

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
    setForm({ property_id: "", start_date: "", end_date: "", reason: "" });
    fetchData();
  };

  const removeBlock = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    toast({ title: "Block removed" });
    fetchData();
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const getDayStatus = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const filterProp = selectedProperty !== "all" ? selectedProperty : null;

    const isBooked = bookings.some(b => {
      if (filterProp && b.property_id !== filterProp) return false;
      return b.status === "confirmed" && dateStr >= b.check_in && dateStr <= b.check_out;
    });
    const isPending = bookings.some(b => {
      if (filterProp && b.property_id !== filterProp) return false;
      return b.status === "pending" && dateStr >= b.check_in && dateStr <= b.check_out;
    });
    const isBlocked = blockedDates.some(bd => {
      if (filterProp && bd.property_id !== filterProp) return false;
      return dateStr >= bd.start_date && dateStr <= bd.end_date;
    });

    if (isBlocked) return "blocked";
    if (isBooked) return "booked";
    if (isPending) return "pending";
    return "available";
  };

  const statusStyles: Record<string, string> = {
    available: "bg-success/15 text-success border-success/20 hover:bg-success/25",
    booked: "bg-destructive/15 text-destructive border-destructive/20",
    pending: "bg-warning/15 text-warning border-warning/20",
    blocked: "bg-muted text-muted-foreground border-border",
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Availability Calendar</h2>
          <p className="text-muted-foreground text-sm">View bookings and manage blocked dates across properties</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Properties" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Block Dates</Button></DialogTrigger>
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
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Available", color: "bg-success/20 border-success/30" },
          { label: "Booked", color: "bg-destructive/20 border-destructive/30" },
          { label: "Pending", color: "bg-warning/20 border-warning/30" },
          { label: "Blocked", color: "bg-muted border-border" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border ${l.color}`} />
            <span className="text-xs text-muted-foreground font-medium">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="font-display text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const status = getDayStatus(day);
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-colors ${statusStyles[status]} ${today ? "ring-2 ring-primary ring-offset-1" : ""}`}
                >
                  <span>{format(day, "d")}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Blocked Dates & Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-3"><CardTitle className="font-display text-base">Blocked Dates</CardTitle></CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">No blocked dates.</p>
            ) : (
              <div className="space-y-2">
                {blockedDates.map((bd) => (
                  <div key={bd.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
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
          <CardHeader className="pb-3"><CardTitle className="font-display text-base">Upcoming Bookings</CardTitle></CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">No upcoming bookings.</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.guest_name}</p>
                      <p className="text-xs text-muted-foreground">{(b as any).properties?.title} · {b.check_in} → {b.check_out}</p>
                    </div>
                    <Badge className={b.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>{b.status}</Badge>
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