import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/dashboard/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, DollarSign, CheckCircle } from "lucide-react";

const AdminAgents = () => {
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      const [refRes, agentRes] = await Promise.all([
        supabase.from("agent_referrals").select("*, properties(title)").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, profiles(full_name, phone_number)").eq("role", "agent"),
      ]);
      setReferrals(refRes.data || []);
      setAgents(agentRes.data || []);
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("agent_referrals").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    toast({ title: `Referral ${status}` });
  };

  const filtered = filter === "all" ? referrals : referrals.filter(r => r.status === filter);
  const totalCommissions = referrals.filter(r => r.status === "completed").reduce((s, r) => s + Number(r.commission_amount), 0);

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
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Agent Management</h2>
        <p className="text-muted-foreground text-sm">Manage referral agents and their commissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Agents" value={agents.length} icon={<UserPlus className="w-5 h-5" />} />
        <StatsCard title="Total Referrals" value={referrals.length} icon={<CheckCircle className="w-5 h-5" />} />
        <StatsCard title="Commissions Paid" value={`$${totalCommissions.toLocaleString()}`} icon={<DollarSign className="w-5 h-5" />} variant="primary" />
      </div>

      <div className="flex gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">No referrals found.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{r.guest_name}</p>
                      <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {r.guest_email} · {r.guest_phone}
                    </p>
                    {(r as any).properties?.title && (
                      <p className="text-sm text-muted-foreground">Property: {(r as any).properties?.title}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Rate: {r.commission_rate}% · Commission: ${Number(r.commission_amount).toLocaleString()}
                    </p>
                  </div>
                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(r.id, "confirmed")}>Confirm</Button>
                      <Button size="sm" variant="outline" className="text-destructive" onClick={() => updateStatus(r.id, "cancelled")}>Cancel</Button>
                    </div>
                  )}
                  {r.status === "confirmed" && (
                    <Button size="sm" onClick={() => updateStatus(r.id, "completed")}>Mark Completed</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAgents;
