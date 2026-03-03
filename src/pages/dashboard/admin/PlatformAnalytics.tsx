import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Building2, CalendarCheck, DollarSign, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PlatformAnalytics = () => {
  const [stats, setStats] = useState({ vendors: 0, newVendors: 0, totalBookings: 0, revenue: 0, commission: 0, conversion: 0 });
  const [topVendors, setTopVendors] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [vendorsRes, bookingsRes] = await Promise.all([
        supabase.from("vendors").select("*"),
        supabase.from("accommodation_bookings").select("*"),
      ]);

      const vendors = vendorsRes.data || [];
      const bookings = bookingsRes.data || [];
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const newVendors = vendors.filter(v => v.created_at.startsWith(thisMonth)).length;
      const activeVendors = vendors.filter(v => v.status === "approved").length;
      const revenue = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.total_price), 0);
      const commission = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + Number(b.commission_amount), 0);
      const confirmed = bookings.filter(b => b.status === "confirmed" || b.status === "completed").length;

      setStats({
        vendors: activeVendors,
        newVendors,
        totalBookings: bookings.length,
        revenue,
        commission,
        conversion: bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0,
      });

      // Top vendors by revenue
      const vendorRevenue: Record<string, { name: string; revenue: number }> = {};
      bookings.forEach(b => {
        if (b.status === "cancelled") return;
        const v = vendors.find(v => v.id === b.vendor_id);
        if (!v) return;
        if (!vendorRevenue[v.id]) vendorRevenue[v.id] = { name: v.business_name, revenue: 0 };
        vendorRevenue[v.id].revenue += Number(b.total_price);
      });
      setTopVendors(Object.values(vendorRevenue).sort((a, b) => b.revenue - a.revenue).slice(0, 5));

      // Monthly
      const months: Record<string, { month: string; revenue: number; commission: number; bookings: number }> = {};
      bookings.forEach(b => {
        const m = b.created_at?.substring(0, 7);
        if (!months[m]) months[m] = { month: m, revenue: 0, commission: 0, bookings: 0 };
        months[m].bookings++;
        if (b.status !== "cancelled") {
          months[m].revenue += Number(b.total_price);
          months[m].commission += Number(b.commission_amount);
        }
      });
      setMonthlyData(Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6));
    };
    load();
  }, []);

  const cards = [
    { label: "Active Vendors", value: stats.vendors, icon: Building2, color: "text-primary" },
    { label: "New This Month", value: stats.newVendors, icon: Users, color: "text-primary" },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-primary" },
    { label: "Platform Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Commission Earned", value: `$${stats.commission.toLocaleString()}`, icon: TrendingUp, color: "text-accent" },
    { label: "Conversion Rate", value: `${stats.conversion}%`, icon: BarChart3, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Platform Analytics</h2>
        <p className="text-muted-foreground">Global performance overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <c.icon className={`w-4 h-4 ${c.color}`} />
                <span className="text-xs text-muted-foreground">{c.label}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="commission" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Commission" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display">Top Vendors by Revenue</CardTitle></CardHeader>
        <CardContent>
          {topVendors.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No vendor data yet.</p>
          ) : (
            <div className="space-y-3">
              {topVendors.map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">#{i + 1}</span>
                    <p className="font-medium text-foreground">{v.name}</p>
                  </div>
                  <p className="font-medium text-foreground">${v.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformAnalytics;
