import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, CreditCard, FileText } from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, properties: 0, bookings: 0, revenue: 0 });
  const [recentProperties, setRecentProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [profiles, props, bookings, payments] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("properties").select("*").order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("payments").select("amount").eq("status", "completed"),
      ]);

      const totalRevenue = payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        users: profiles.count || 0,
        properties: props.data?.length || 0,
        bookings: bookings.count || 0,
        revenue: totalRevenue,
      });
      setRecentProperties(props.data || []);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Users" value={stats.users} icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Total Properties" value={stats.properties} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Total Bookings" value={stats.bookings} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="Platform Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Recent Properties</CardTitle>
        </CardHeader>
        <CardContent>
          {recentProperties.length === 0 ? (
            <p className="text-muted-foreground text-sm">No properties listed yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProperties.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-sm text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.city} · {p.property_type}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {p.status}
                  </span>
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
