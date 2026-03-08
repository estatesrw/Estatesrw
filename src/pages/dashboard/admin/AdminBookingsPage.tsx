import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Download, CalendarCheck, DollarSign, Clock, UserCheck, LogIn } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const BOOKING_STATUSES: Record<string, { label: string; color: string; next?: string; nextLabel?: string }> = {
  requested: { label: "Requested", color: "bg-info/10 text-info", next: "pending_payment", nextLabel: "Approve → Pending Payment" },
  pending_payment: { label: "Pending Payment", color: "bg-warning/10 text-warning", next: "confirmed", nextLabel: "Confirm Payment" },
  pending: { label: "Requested", color: "bg-info/10 text-info", next: "pending_payment", nextLabel: "Approve → Pending Payment" },
  confirmed: { label: "Confirmed", color: "bg-success/10 text-success", next: "checked_in", nextLabel: "Check In" },
  checked_in: { label: "Checked In", color: "bg-primary/10 text-primary", next: "completed", nextLabel: "Mark Completed" },
  completed: { label: "Completed", color: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
};

const AdminBookingsPage = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, requested: 0, pendingPayment: 0, confirmed: 0, revenue: 0 });

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
      requested: all.filter(b => b.status === "requested" || b.status === "pending").length,
      pendingPayment: all.filter(b => b.status === "pending_payment").length,
      confirmed: all.filter(b => b.status === "confirmed" || b.status === "checked_in").length,
      revenue: all.filter(b => !["cancelled", "requested", "pending"].includes(b.status)).reduce((s, b) => s + Number(b.total_price), 0),
    });
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const advanceStatus = async (id: string, newStatus: string) => {
    const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
    
    if (newStatus === "confirmed") {
      updates.payment_status = "paid";
      updates.approved_at = new Date().toISOString();
      
      // Create commission record
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
    }

    await supabase.from("accommodation_bookings").update(updates).eq("id", id);
    toast({ title: `Booking updated to ${BOOKING_STATUSES[newStatus]?.label || newStatus}` });
    fetchBookings();
  };

  const rejectBooking = async (id: string) => {
    await supabase.from("accommodation_bookings").update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    }).eq("id", id);
    toast({ title: "Booking cancelled" });
    fetchBookings();
  };

  const exportCSV = () => {
    const headers = ["Ref", "Vendor", "Guest", "Property", "Check-in", "Check-out", "Total", "Commission", "Status"];
    const rows = bookings.map(b => [b.booking_ref, (b as any).vendors?.business_name, b.guest_name, (b as any).properties?.title, b.check_in, b.check_out, b.total_price, b.commission_amount, b.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings-export.csv"; a.click();
  };

  const filtered = bookings.filter(b =>
    !search || b.guest_name?.toLowerCase().includes(search.toLowerCase()) || b.booking_ref?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Booking Management</h2>
          <p className="text-muted-foreground">Manage booking requests and payment confirmations</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard title="Total" value={stats.total} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Requested" value={stats.requested} icon={<Clock className="w-5 h-5" />} variant="accent" />
        <StatsCard title="Pending Payment" value={stats.pendingPayment} icon={<DollarSign className="w-5 h-5" />} />
        <StatsCard title="Confirmed" value={stats.confirmed} icon={<Check className="w-5 h-5" />} />
        <StatsCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="primary" />
      </div>

      {/* Booking flow diagram */}
      <Card className="shadow-card border-primary/10 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Booking Flow</p>
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            {["Requested", "→", "Pending Payment", "→", "Confirmed", "→", "Checked In", "→", "Completed"].map((s, i) => (
              <span key={i} className={s === "→" ? "" : "px-2 py-1 rounded bg-card border border-border font-medium"}>{s}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search guest or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="requested">Requested</SelectItem>
            <SelectItem value="pending">Legacy Pending</SelectItem>
            <SelectItem value="pending_payment">Pending Payment</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No bookings found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const st = BOOKING_STATUSES[b.status] || { label: b.status, color: "bg-muted text-muted-foreground" };
            return (
              <Card key={b.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-foreground">{b.guest_name}</p>
                        <Badge className={st.color}>{st.label}</Badge>
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
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      {"next" in st && st.next && (
                        <Button size="sm" onClick={() => advanceStatus(b.id, st.next!)}>
                          <Check className="w-4 h-4 mr-1" /> {st.nextLabel}
                        </Button>
                      )}
                      {!["completed", "cancelled"].includes(b.status) && (
                        <Button size="sm" variant="outline" onClick={() => rejectBooking(b.id)} className="text-destructive">
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
