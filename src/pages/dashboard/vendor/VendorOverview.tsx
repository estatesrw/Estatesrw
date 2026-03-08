import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import { BarChart3, BedDouble, CalendarCheck, DollarSign, ArrowUpRight, ArrowRight, Building2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const VendorOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, commission: 0, payout: 0, upcoming: 0, occupancy: 0, pending: 0, properties: 0, units: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
      if (!v) { setLoading(false); return; }
      setVendor(v);

      const [bookingsRes, propsRes, unitsRes] = await Promise.all([
        supabase.from("accommodation_bookings").select("*").eq("vendor_id", v.id).order("created_at", { ascending: false }),
        supabase.from("properties").select("id").eq("landlord_id", user.id),
        supabase.from("room_types").select("id").eq("vendor_id", v.id),
      ]);

      const all = bookingsRes.data || [];
      const today = new Date().toISOString().split("T")[0];
      const active = all.filter(b => b.status !== "cancelled");
      const revenue = active.reduce((s, b) => s + Number(b.total_price), 0);
      const commission = active.reduce((s, b) => s + Number(b.commission_amount), 0);
      const upcoming = all.filter(b => b.check_in >= today && b.status === "confirmed").length;
      const pending = all.filter(b => b.status === "pending").length;

      setStats({
        totalBookings: all.length,
        revenue, commission,
        payout: revenue - commission,
        upcoming, pending,
        properties: propsRes.data?.length || 0,
        units: unitsRes.data?.length || 0,
        occupancy: all.length > 0 ? Math.round((all.filter(b => ["confirmed", "completed", "checked_in"].includes(b.status)).length / all.length) * 100) : 0,
      });
      setRecentBookings(all.slice(0, 5));

      // Monthly chart
      const months: Record<string, { month: string; revenue: number; bookings: number }> = {};
      active.forEach(b => {
        const m = b.created_at?.substring(0, 7);
        if (!months[m]) months[m] = { month: m, revenue: 0, bookings: 0 };
        months[m].revenue += Number(b.total_price);
        months[m].bookings += 1;
      });
      setChartData(Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6));

      setLoading(false);
    };
    load();

    // Subscribe to vendor status changes for auto-update on approval
    const channel = supabase
      .channel('vendor-status')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vendors', filter: `user_id=eq.${user.id}` }, () => {
        load();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="shadow-elevated max-w-md w-full">
          <CardContent className="p-10 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <BedDouble className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Register as a Vendor</h2>
            <p className="text-muted-foreground text-sm">List your hotel, apartment, or guesthouse on EstatesRW and start receiving bookings.</p>
            <Button onClick={() => navigate("/dashboard/vendor/register")} size="lg" className="mt-2">
              Get Started <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendor.status === "pending") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="shadow-elevated max-w-md w-full border-amber-500/20">
          <CardContent className="p-10 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-foreground">Application Under Review</h2>
            <p className="text-muted-foreground text-sm">Your vendor application is being reviewed.</p>
            <Badge className="bg-amber-500/10 text-amber-600">Pending Approval</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendor.status === "suspended") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="shadow-elevated max-w-md w-full border-destructive/20">
          <CardContent className="p-10 text-center space-y-4">
            <h2 className="font-display text-2xl font-bold text-destructive">Account Suspended</h2>
            <p className="text-muted-foreground text-sm">Your vendor account has been suspended. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-emerald-500/10 text-emerald-600";
      case "checked_in": return "bg-blue-500/10 text-blue-600";
      case "completed": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-amber-500/10 text-amber-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{vendor.business_name}</h2>
          <p className="text-muted-foreground text-sm">Commission rate: {vendor.commission_rate}% · {vendor.city}</p>
        </div>
        <Badge className="bg-primary/10 text-primary font-semibold">{vendor.business_type}</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Properties" value={stats.properties} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Units / Rooms" value={stats.units} icon={<BedDouble className="w-5 h-5" />} />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Pending Approval" value={stats.pending} icon={<CalendarCheck className="w-5 h-5" />} variant="accent" />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-primary text-primary-foreground shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">Gross Revenue</p>
          <p className="text-3xl font-bold mt-1 font-sans">${stats.revenue.toLocaleString()}</p>
          <p className="text-xs text-primary-foreground/60 mt-1">Commission: ${stats.commission.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Net Earnings</p>
          <p className="text-3xl font-bold mt-1 text-foreground font-sans">${stats.payout.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">After {vendor.commission_rate}% platform fee</p>
        </div>
        <div className="p-5 rounded-2xl bg-card border border-border shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Actions</p>
          <div className="flex flex-col gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={() => navigate("/dashboard/vendor/bookings")} className="justify-start text-xs">
              <CalendarCheck className="w-3.5 h-3.5 mr-2" /> View Bookings ({stats.pending} pending)
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/dashboard/vendor/calendar")} className="justify-start text-xs">
              <BarChart3 className="w-3.5 h-3.5 mr-2" /> Availability Calendar
            </Button>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {chartData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="font-display text-base">Monthly Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base">Recent Bookings</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate("/dashboard/vendor/bookings")}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No bookings yet. Share your listings to attract guests!</p>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{b.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{b.booking_ref} · {b.check_in} → {b.check_out}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="font-semibold text-sm text-foreground">${Number(b.total_price).toLocaleString()}</span>
                    <Badge className={statusColor(b.status)}>{b.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOverview;
