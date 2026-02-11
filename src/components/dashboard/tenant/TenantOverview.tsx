import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, CreditCard, Wrench } from "lucide-react";

const TenantOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ applications: 0, bookings: 0, payments: 0, tickets: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [apps, bookings, payments, tickets] = await Promise.all([
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("tenant_id", user.id),
        supabase.from("bookings").select("*, properties(title, address, city)").eq("tenant_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("id", { count: "exact", head: true }).eq("tenant_id", user.id),
        supabase.from("maintenance_tickets").select("id", { count: "exact", head: true }).eq("reported_by", user.id),
      ]);
      setStats({
        applications: apps.count || 0,
        bookings: bookings.data?.length || 0,
        payments: payments.count || 0,
        tickets: tickets.count || 0,
      });
      setRecentBookings(bookings.data || []);
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground">Here's an overview of your rental activity.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Applications" value={stats.applications} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="Active Bookings" value={stats.bookings} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Payments Made" value={stats.payments} icon={<CreditCard className="w-5 h-5" />} />
        <StatsCard title="Maintenance Tickets" value={stats.tickets} icon={<Wrench className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="font-display">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm">No bookings yet. Browse properties to get started!</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-sm text-foreground">{(b.properties as any)?.title}</p>
                    <p className="text-xs text-muted-foreground">{(b.properties as any)?.city}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    b.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {b.status}
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

export default TenantOverview;
