import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/StatsCard";
import { UserPlus, DollarSign, CalendarCheck, TrendingUp, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AgentOverview = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("agent_referrals")
        .select("*")
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });
      setReferrals(data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  const totalCommission = referrals.filter(r => r.status === "completed").reduce((s, r) => s + Number(r.commission_amount), 0);
  const pendingCount = referrals.filter(r => r.status === "pending").length;
  const completedCount = referrals.filter(r => r.status === "completed").length;

  const statusColor = (s: string) => {
    switch (s) {
      case "completed": return "bg-success/10 text-success";
      case "confirmed": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-warning/10 text-warning";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Welcome{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
          </h2>
          <p className="text-muted-foreground text-sm">Your referral activity at a glance.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/agent/referrals")}>
          New Referral <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Total Referrals" value={referrals.length} icon={<UserPlus className="w-5 h-5" />} />
        <StatsCard title="Pending" value={pendingCount} icon={<CalendarCheck className="w-5 h-5" />} variant="accent" />
        <StatsCard title="Completed" value={completedCount} icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Earnings" value={`$${totalCommission.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="primary" />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-base">Recent Referrals</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => navigate("/dashboard/agent/referrals")}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-12 h-12 mx-auto mb-4 text-primary/30" />
              <p className="text-muted-foreground text-sm">No referrals yet. Start referring guests to earn commissions!</p>
              <Button className="mt-4" onClick={() => navigate("/dashboard/agent/referrals")}>
                Create First Referral
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.slice(0, 8).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{r.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{r.guest_email} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {r.commission_amount > 0 && (
                      <span className="font-semibold text-sm text-foreground">${Number(r.commission_amount).toLocaleString()}</span>
                    )}
                    <Badge className={statusColor(r.status)}>{r.status}</Badge>
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

export default AgentOverview;
