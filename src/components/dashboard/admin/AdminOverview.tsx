import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, CreditCard, FileText, BedDouble, CalendarCheck, TrendingUp, ShieldCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0, revenue: 0, vendors: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentVendors, setRecentVendors] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [profiles, props, bookings, payments, vendors, accBookings] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "completed"),
        supabase.from("vendors").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("accommodation_bookings").select("*").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalRevenue = payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
      const pendingCount = (accBookings.data || []).filter(b => b.status === "pending").length;

      setStats({
        users: profiles.count || 0,
        properties: props.count || 0,
        bookings: (bookings.count || 0),
        revenue: totalRevenue,
        vendors: (vendors.data || []).length,
        pending: pendingCount,
      });
      setRecentBookings(accBookings.data || []);
      setRecentVendors(vendors.data || []);
    };
    fetchData();
  }, []);

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": case "approved": return "bg-success/10 text-success";
      case "completed": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      case "pending": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const pieData = [
    { name: "Confirmed", value: recentBookings.filter(b => b.status === "confirmed").length, color: "hsl(155, 70%, 35%)" },
    { name: "Pending", value: recentBookings.filter(b => b.status === "pending").length, color: "hsl(38, 92%, 50%)" },
    { name: "Cancelled", value: recentBookings.filter(b => b.status === "cancelled").length, color: "hsl(0, 84%, 60%)" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Platform Overview</h2>
        <p className="text-muted-foreground text-sm">Monitor all activity across EstatesRW.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Total Users" value={stats.users} icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Properties" value={stats.properties} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Bookings" value={stats.bookings} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} variant="primary" />
        <StatsCard title="Active Vendors" value={stats.vendors} icon={<BedDouble className="w-5 h-5" />} />
        <StatsCard title="Pending Approval" value={stats.pending} icon={<CalendarCheck className="w-5 h-5" />} variant="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Recent Accommodation Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No bookings yet.</p>
            ) : (
              <div className="space-y-2">
                {recentBookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">{b.guest_name}</p>
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

        {/* Booking Status Pie */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">No data yet.</p>
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Vendors */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Recent Vendors</CardTitle>
        </CardHeader>
        <CardContent>
          {recentVendors.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No vendors registered yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentVendors.map((v) => (
                <div key={v.id} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{v.business_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.city} · {v.business_type}</p>
                    </div>
                    <Badge className={v.status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                      {v.status}
                    </Badge>
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

export default AdminOverview;