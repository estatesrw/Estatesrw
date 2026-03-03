import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, BedDouble, CalendarCheck, DollarSign, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VendorOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, commission: 0, payout: 0, upcoming: 0, occupancy: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
      if (!v) { setLoading(false); return; }
      setVendor(v);

      const { data: bookings } = await supabase
        .from("accommodation_bookings")
        .select("*")
        .eq("vendor_id", v.id)
        .order("created_at", { ascending: false });

      const all = bookings || [];
      const today = new Date().toISOString().split("T")[0];
      const revenue = all.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.total_price), 0);
      const commission = all.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.commission_amount), 0);
      const upcoming = all.filter(b => b.check_in >= today && b.status === "confirmed").length;

      setStats({
        totalBookings: all.length,
        revenue,
        commission,
        payout: revenue - commission,
        upcoming,
        occupancy: all.length > 0 ? Math.round((all.filter(b => b.status === "confirmed" || b.status === "completed").length / all.length) * 100) : 0,
      });
      setRecentBookings(all.slice(0, 5));
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  if (!vendor) {
    return (
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardContent className="p-12 text-center space-y-4">
            <BedDouble className="w-16 h-16 mx-auto text-primary/40" />
            <h2 className="font-display text-2xl font-bold text-foreground">Register as a Vendor</h2>
            <p className="text-muted-foreground max-w-md mx-auto">List your hotel, apartment, or guesthouse on EstatesRW and start receiving bookings.</p>
            <Button onClick={() => navigate("/dashboard/vendor/register")} className="mt-4">Register Your Property <ArrowUpRight className="w-4 h-4 ml-2" /></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (vendor.status === "pending") {
    return (
      <Card className="shadow-card">
        <CardContent className="p-12 text-center space-y-4">
          <CalendarCheck className="w-16 h-16 mx-auto text-accent" />
          <h2 className="font-display text-2xl font-bold text-foreground">Application Under Review</h2>
          <p className="text-muted-foreground">Your vendor application is being reviewed by our team. You'll be notified once approved.</p>
          <Badge className="bg-accent/10 text-accent">Pending Approval</Badge>
        </CardContent>
      </Card>
    );
  }

  if (vendor.status === "suspended") {
    return (
      <Card className="shadow-card border-destructive">
        <CardContent className="p-12 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-destructive">Account Suspended</h2>
          <p className="text-muted-foreground">Your vendor account has been suspended. Please contact support for more information.</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-primary" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Commission Paid", value: `$${stats.commission.toLocaleString()}`, icon: TrendingUp, color: "text-accent" },
    { label: "Net Payout", value: `$${stats.payout.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Upcoming Check-ins", value: stats.upcoming, icon: Users, color: "text-primary" },
    { label: "Occupancy Rate", value: `${stats.occupancy}%`, icon: BarChart3, color: "text-accent" },
  ];

  const statusColor = (s: string) => {
    switch (s) { case "confirmed": return "bg-primary/10 text-primary"; case "completed": return "bg-primary/10 text-primary"; case "cancelled": return "bg-destructive/10 text-destructive"; default: return "bg-accent/10 text-accent"; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{vendor.business_name}</h2>
          <p className="text-muted-foreground">Commission rate: {vendor.commission_rate}%</p>
        </div>
        <Badge className="bg-primary/10 text-primary">{vendor.business_type}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{b.guest_name}</p>
                    <p className="text-sm text-muted-foreground">{b.booking_ref} · {b.check_in} → {b.check_out}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">${Number(b.total_price).toLocaleString()}</p>
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
