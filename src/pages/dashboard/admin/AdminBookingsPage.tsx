import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Download, CalendarCheck, DollarSign } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const AdminBookingsPage = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, revenue: 0 });

  const fetchBookings = async () => {
    let q = supabase
      .from("accommodation_bookings")
      .select("*, room_types(name), properties(title), vendors(business_name)")
      .order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    const all = data || [];
    setBookings(all);
    setStats({
      total: all.length,
      pending: all.filter(b => b.status === "pending").length,
      approved: all.filter(b => b.status === "confirmed").length,
      revenue: all.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.total_price), 0),
    });
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const approveBooking = async (id: string) => {
    await supabase.from("accommodation_bookings").update({
      status: "confirmed",
      payment_status: "paid",
      approved_at: new Date().toISOString(),
    }).eq("id", id);

    // Find booking to create commission record
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      const vendor = await supabase.from("vendors").select("commission_rate").eq("id", booking.vendor_id).maybeSingle();
      const rate = vendor.data?.commission_rate || 10;
      const commissionAmount = Number(booking.total_price) * (rate / 100);
      const vendorPayout = Number(booking.total_price) - commissionAmount;
      await supabase.from("vendor_commissions").insert({
        vendor_id: booking.vendor_id,
        booking_id: booking.id,
        booking_amount: booking.total_price,
        commission_rate: rate,
        commission_amount: commissionAmount,
        vendor_payout: vendorPayout,
      });
    }

    toast({ title: "Booking approved & payment verified" });
    fetchBookings();
  };

  const rejectBooking = async (id: string) => {
    await supabase.from("accommodation_bookings").update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    }).eq("id", id);
    toast({ title: "Booking rejected" });
    fetchBookings();
  };

  const exportCSV = () => {
    const headers = ["Ref", "Vendor", "Guest", "Property", "Check-in", "Check-out", "Total", "Commission", "Status"];
    const rows = bookings.map(b => [b.booking_ref, (b as any).vendors?.business_name, b.guest_name, (b as any).properties?.title, b.check_in, b.check_out, b.total_price, b.commission_amount, b.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "admin-bookings.csv"; a.click();
  };

  const filtered = bookings.filter(b =>
    !search || b.guest_name?.toLowerCase().includes(search.toLowerCase()) || b.booking_ref?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-primary/10 text-primary";
      case "completed": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      case "pending": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return "Awaiting Payment Verification";
      case "confirmed": return "Approved";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return s;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Booking Management</h2>
          <p className="text-muted-foreground">Verify payments and approve bookings</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Bookings" value={stats.total} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Awaiting Approval" value={stats.pending} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Approved" value={stats.approved} icon={<Check className="w-5 h-5" />} />
        <StatsCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search guest or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Awaiting Approval</SelectItem>
            <SelectItem value="confirmed">Approved</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No bookings found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{b.guest_name}</p>
                      <Badge className={statusColor(b.status)}>{statusLabel(b.status)}</Badge>
                      <span className="text-xs text-muted-foreground">{b.booking_ref}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">{(b as any).vendors?.business_name}</span> · {(b as any).properties?.title} · {(b as any).room_types?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{b.check_in} → {b.check_out} ({b.nights} nights) · {b.guests} guest(s)</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      Total: ${Number(b.total_price).toLocaleString()} · Commission: ${Number(b.commission_amount).toLocaleString()} · Payout: ${Number(b.vendor_payout).toLocaleString()}
                    </p>
                    {b.guest_email && <p className="text-xs text-muted-foreground mt-1">{b.guest_email} · {b.guest_phone}</p>}
                    {b.payment_method && <p className="text-xs text-muted-foreground">Payment: {b.payment_method} · {b.payment_status}</p>}
                  </div>
                  {b.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" onClick={() => approveBooking(b.id)}>
                        <Check className="w-4 h-4 mr-1" /> Verify & Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => rejectBooking(b.id)} className="text-destructive">
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
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

export default AdminBookingsPage;
