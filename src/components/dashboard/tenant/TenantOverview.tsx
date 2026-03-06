import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import StatsCard from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, FileText, CreditCard, Wrench, CalendarCheck, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TenantOverview = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ applications: 0, bookings: 0, payments: 0, tickets: 0, saved: 0, accBookings: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [apps, bookings, payments, tickets, saved, accBookings] = await Promise.all([
        supabase.from("applications").select("id", { count: "exact", head: true }).eq("tenant_id", user.id),
        supabase.from("bookings").select("*, properties(title, city)").eq("tenant_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("payments").select("id", { count: "exact", head: true }).eq("tenant_id", user.id),
        supabase.from("maintenance_tickets").select("id", { count: "exact", head: true }).eq("reported_by", user.id),
        supabase.from("saved_properties").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("accommodation_bookings").select("id", { count: "exact", head: true }).eq("guest_id", user.id),
      ]);
      setStats({
        applications: apps.count || 0,
        bookings: bookings.data?.length || 0,
        payments: payments.count || 0,
        tickets: tickets.count || 0,
        saved: saved.count || 0,
        accBookings: accBookings.count || 0,
      });
      setRecentBookings(bookings.data || []);
    };
    fetchData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
          </h2>
          <p className="text-muted-foreground text-sm">Your rental and booking activity at a glance.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/browse")} className="hidden sm:flex">
          Browse Properties <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Applications" value={stats.applications} icon={<FileText className="w-5 h-5" />} />
        <StatsCard title="Active Rentals" value={stats.bookings} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Acc. Bookings" value={stats.accBookings} icon={<CalendarCheck className="w-5 h-5" />} variant="accent" />
        <StatsCard title="Saved" value={stats.saved} icon={<Heart className="w-5 h-5" />} />
        <StatsCard title="Payments" value={stats.payments} icon={<CreditCard className="w-5 h-5" />} />
        <StatsCard title="Tickets" value={stats.tickets} icon={<Wrench className="w-5 h-5" />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Browse Properties", href: "/dashboard/browse", icon: Building2 },
          { label: "My Bookings", href: "/dashboard/guest-bookings", icon: CalendarCheck },
          { label: "Saved Properties", href: "/dashboard/saved", icon: Heart },
          { label: "Payment History", href: "/dashboard/guest-payments", icon: CreditCard },
        ].map(a => (
          <button
            key={a.href}
            onClick={() => navigate(a.href)}
            className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-card transition-all text-left group"
          >
            <div className="p-2.5 rounded-lg bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <a.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Recent Rental Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {recentBookings.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No bookings yet. Start browsing properties!</p>
          ) : (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div>
                    <p className="font-medium text-sm text-foreground">{(b.properties as any)?.title}</p>
                    <p className="text-xs text-muted-foreground">{(b.properties as any)?.city}</p>
                  </div>
                  <Badge className={b.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                    {b.status}
                  </Badge>
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