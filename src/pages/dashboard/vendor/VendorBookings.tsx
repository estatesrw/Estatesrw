import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Download, Check, X } from "lucide-react";

const VendorBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    let q = supabase.from("accommodation_bookings").select("*, room_types(name), properties(title)").eq("vendor_id", v.id).order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setBookings(data || []);
  };

  useEffect(() => { fetchData(); }, [user, filter]);

  const updateStatus = async (id: string, status: string) => {
    const update: any = { status };
    if (status === "confirmed") update.approved_at = new Date().toISOString();
    if (status === "cancelled") update.cancelled_at = new Date().toISOString();
    await supabase.from("accommodation_bookings").update(update).eq("id", id);
    toast({ title: `Booking ${status}` });
    fetchData();
  };

  const exportCSV = () => {
    const headers = ["Ref", "Guest", "Check-in", "Check-out", "Nights", "Total", "Commission", "Status"];
    const rows = bookings.map(b => [b.booking_ref, b.guest_name, b.check_in, b.check_out, b.nights, b.total_price, b.commission_amount, b.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
  };

  const filtered = bookings.filter(b => !search || b.guest_name?.toLowerCase().includes(search.toLowerCase()) || b.booking_ref?.toLowerCase().includes(search.toLowerCase()));

  const statusColor = (s: string) => {
    switch (s) { case "confirmed": return "bg-primary/10 text-primary"; case "completed": return "bg-primary/10 text-primary"; case "cancelled": return "bg-destructive/10 text-destructive"; case "no_show": return "bg-destructive/10 text-destructive"; default: return "bg-accent/10 text-accent"; }
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Bookings</h2>
          <p className="text-muted-foreground">{bookings.length} total bookings</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search guest or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground"><CalendarCheck className="w-12 h-12 mx-auto mb-4 text-primary/30" />No bookings found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{b.guest_name}</p>
                      <Badge className={statusColor(b.status)}>{b.status}</Badge>
                      <span className="text-xs text-muted-foreground">{b.booking_ref}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(b as any).properties?.title} · {(b as any).room_types?.name} · {b.check_in} → {b.check_out} ({b.nights} nights)
                    </p>
                    <p className="text-sm text-muted-foreground">{b.guests} guest(s) · ${Number(b.total_price).toLocaleString()} · Commission: ${Number(b.commission_amount).toLocaleString()}</p>
                    {b.guest_email && <p className="text-xs text-muted-foreground">{b.guest_email} · {b.guest_phone}</p>}
                  </div>
                  {b.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(b.id, "confirmed")}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "cancelled")} className="text-destructive"><X className="w-4 h-4 mr-1" /> Reject</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorBookings;
