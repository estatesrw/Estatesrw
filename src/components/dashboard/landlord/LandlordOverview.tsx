import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CreditCard, Wrench, ClipboardList } from "lucide-react";

const LandlordOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ properties: 0, applications: 0, bookings: 0, tickets: 0, revenue: 0 });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [props, apps, bookings, tickets, payments] = await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }).eq("landlord_id", user.id),
        supabase.from("applications").select("*, properties!inner(landlord_id, title)").eq("properties.landlord_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("id, properties!inner(landlord_id)", { count: "exact", head: true }).eq("properties.landlord_id", user.id),
        supabase.from("maintenance_tickets").select("id, properties!inner(landlord_id)", { count: "exact", head: true }).eq("properties.landlord_id", user.id),
        supabase.from("payments").select("amount, bookings!inner(property_id, properties!inner(landlord_id))").eq("bookings.properties.landlord_id", user.id).eq("status", "completed"),
      ]);

      const totalRevenue = payments.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      setStats({
        properties: props.count || 0,
        applications: apps.data?.length || 0,
        bookings: bookings.count || 0,
        tickets: tickets.count || 0,
        revenue: totalRevenue,
      });
      setRecentApplications(apps.data || []);
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Landlord Dashboard</h2>
        <p className="text-muted-foreground">Manage your properties and tenants.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Properties" value={stats.properties} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Applications" value={stats.applications} icon={<ClipboardList className="w-5 h-5" />} />
        <StatsCard title="Active Bookings" value={stats.bookings} icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Open Tickets" value={stats.tickets} icon={<Wrench className="w-5 h-5" />} />
        <StatsCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Recent Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApplications.length === 0 ? (
            <p className="text-muted-foreground text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-sm text-foreground">{(a.properties as any)?.title}</p>
                    <p className="text-xs text-muted-foreground">Applied {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    a.status === "pending" ? "bg-accent/20 text-accent-foreground" :
                    a.status === "approved" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}>
                    {a.status}
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

export default LandlordOverview;
