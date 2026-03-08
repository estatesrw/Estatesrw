import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/dashboard/StatsCard";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

const AgentCommissions = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("agent_referrals")
      .select("*")
      .eq("agent_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReferrals(data || []));
  }, [user]);

  const completed = referrals.filter(r => r.status === "completed");
  const pending = referrals.filter(r => r.status === "pending" || r.status === "confirmed");
  const totalEarned = completed.reduce((s, r) => s + Number(r.commission_amount), 0);
  const pendingAmount = pending.reduce((s, r) => s + Number(r.commission_amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Commission History</h2>
        <p className="text-muted-foreground text-sm">Track your earnings from guest referrals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Earned" value={`$${totalEarned.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="primary" />
        <StatsCard title="Pending" value={`$${pendingAmount.toLocaleString()}`} icon={<Clock className="w-5 h-5" />} variant="accent" />
        <StatsCard title="Completed Referrals" value={completed.length} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Commission Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.filter(r => r.commission_amount > 0).length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">No commission records yet.</p>
          ) : (
            <div className="space-y-2">
              {referrals.filter(r => r.commission_amount > 0).map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-medium text-sm text-foreground">{r.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{r.commission_rate}% rate · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">${Number(r.commission_amount).toLocaleString()}</span>
                    <Badge className={r.status === "completed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                      {r.status}
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

export default AgentCommissions;
