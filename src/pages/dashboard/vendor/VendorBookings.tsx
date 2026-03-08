import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Download, Clock, CheckCircle2, XCircle, LogIn } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Awaiting Approval", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  confirmed: { label: "Confirmed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  checked_in: { label: "Checked In", icon: <LogIn className="w-3.5 h-3.5" />, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-primary/10 text-primary" },
  cancelled: { label: "Cancelled", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-destructive/10 text-destructive" },
};

const VendorBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    const { data } = await supabase
      .from("accommodation_bookings")
      .select("*, room_types(name), properties(title)")
      .eq("vendor_id", v.id)
      .order("created_at", { ascending: false });
    setBookings(data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const exportCSV = () => {
    const headers = ["Ref", "Guest", "Property", "Room", "Check-in", "Check-out", "Nights", "Total", "Commission", "Status"];
    const rows = bookings.map(b => [
      b.booking_ref, b.guest_name, (b as any).properties?.title, (b as any).room_types?.name,
      b.check_in, b.check_out, b.nights, b.total_price, b.commission_amount, b.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
  };

  const filtered = bookings
    .filter(b => tab === "all" || b.status === tab)
    .filter(b => !search || b.guest_name?.toLowerCase().includes(search.toLowerCase()) || b.booking_ref?.toLowerCase().includes(search.toLowerCase()));

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    checkedIn: bookings.filter(b => b.status === "checked_in").length,
    revenue: bookings.filter(b => !["cancelled"].includes(b.status)).reduce((s, b) => s + Number(b.vendor_payout), 0),
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Bookings</h2>
          <p className="text-muted-foreground text-sm">All booking requests and reservations</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "Confirmed", value: stats.confirmed, color: "text-emerald-600" },
          { label: "Checked In", value: stats.checkedIn, color: "text-blue-600" },
          { label: "Net Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "text-primary" },
        ].map(s => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{s.label}</p>
              <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search guest name or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({stats.confirmed})</TabsTrigger>
          <TabsTrigger value="checked_in">Checked In ({stats.checkedIn})</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center text-muted-foreground">
                <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-primary/30" />
                <p>No bookings found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered.map((b) => {
                const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                return (
                  <Card key={b.id} className="shadow-card hover:shadow-elevated transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{b.guest_name}</h3>
                            <Badge className={cfg.color}>
                              {cfg.icon}
                              <span className="ml-1">{cfg.label}</span>
                            </Badge>
                            <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{b.booking_ref}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{(b as any).properties?.title}</span>
                            {" · "}
                            <span>{(b as any).room_types?.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>📅 {b.check_in} → {b.check_out} ({b.nights} nights)</span>
                            <span>👥 {b.guests} guest(s)</span>
                            {b.guest_email && <span>✉️ {b.guest_email}</span>}
                            {b.guest_phone && <span>📱 {b.guest_phone}</span>}
                          </div>
                        </div>
                        <div className="text-right space-y-1 shrink-0">
                          <p className="text-lg font-bold text-foreground">${Number(b.total_price).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Commission: ${Number(b.commission_amount).toLocaleString()}</p>
                          <p className="text-xs font-medium text-primary">Payout: ${Number(b.vendor_payout).toLocaleString()}</p>
                        </div>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 rounded bg-muted/50">📝 {b.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorBookings;
