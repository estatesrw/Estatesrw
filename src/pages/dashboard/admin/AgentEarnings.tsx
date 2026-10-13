import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/dashboard/StatsCard";
import { Wallet, Megaphone, TrendingUp, Users, Download } from "lucide-react";
import { formatMoney } from "@/lib/unitStatus";

interface Row { id: string; name: string; phone: string; referrals: number; earned: number; pending: number; marketing: number; leads: number; won: number }

const AgentEarnings = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [roles, refs, costs, leads] = await Promise.all([
        supabase.from("user_roles").select("user_id").eq("role", "agent"),
        supabase.from("agent_referrals").select("agent_id, status, commission_amount"),
        supabase.from("agent_marketing_costs").select("agent_id, amount"),
        supabase.from("agent_leads").select("agent_id, stage"),
      ]);
      const ids = Array.from(new Set([
        ...(roles.data || []).map((r) => r.user_id),
        ...(refs.data || []).map((r) => r.agent_id),
      ]));
      const { data: profiles } = ids.length
        ? await supabase.from("profiles").select("id, full_name, phone_number").in("id", ids)
        : { data: [] as any[] };
      const map: Record<string, Row> = {};
      ids.forEach((id) => {
        const p = (profiles || []).find((x: any) => x.id === id);
        map[id] = { id, name: p?.full_name || "Unnamed agent", phone: p?.phone_number || "", referrals: 0, earned: 0, pending: 0, marketing: 0, leads: 0, won: 0 };
      });
      (refs.data || []).forEach((r) => {
        const m = map[r.agent_id]; if (!m) return;
        m.referrals++;
        if (r.status === "completed") m.earned += Number(r.commission_amount);
        else if (r.status === "pending" || r.status === "confirmed") m.pending += Number(r.commission_amount);
      });
      (costs.data || []).forEach((c) => { if (map[c.agent_id]) map[c.agent_id].marketing += Number(c.amount); });
      (leads.data || []).forEach((l) => { const m = map[l.agent_id]; if (!m) return; m.leads++; if (l.stage === "won") m.won++; });
      setRows(Object.values(map).sort((a, b) => b.earned - a.earned));
      setLoading(false);
    })();
  }, []);

  const totals = useMemo(() => rows.reduce((t, r) => ({ earned: t.earned + r.earned, pending: t.pending + r.pending, marketing: t.marketing + r.marketing }), { earned: 0, pending: 0, marketing: 0 }), [rows]);

  const exportCsv = () => {
    const lines = [["Agent", "Phone", "Referrals", "Leads", "Won", "Earned", "Pending", "Marketing", "Net"],
      ...rows.map((r) => [r.name, r.phone, r.referrals, r.leads, r.won, r.earned, r.pending, r.marketing, r.earned - r.marketing])];
    const csv = lines.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "agent-earnings.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Agent earnings</h2>
          <p className="text-muted-foreground text-sm">How much each agent earns, what they spend on marketing, and their leads.</p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={!rows.length}><Download className="w-4 h-4 mr-2" />CSV</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard title="Agents" value={rows.length} icon={<Users className="w-5 h-5" />} />
        <StatsCard title="Commission earned" value={formatMoney(totals.earned)} icon={<Wallet className="w-5 h-5" />} variant="primary" />
        <StatsCard title="Pending commission" value={formatMoney(totals.pending)} icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Marketing spend" value={formatMoney(totals.marketing)} icon={<Megaphone className="w-5 h-5" />} />
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        {loading ? <p className="p-6 text-sm text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">No agents have signed up yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b border-border">
              <tr><th className="p-3">Agent</th><th className="p-3 text-right">Referrals</th><th className="p-3 text-right">Leads (won)</th><th className="p-3 text-right">Earned</th><th className="p-3 text-right">Pending</th><th className="p-3 text-right">Marketing</th><th className="p-3 text-right">Net</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="p-3"><p className="font-medium text-foreground">{r.name}</p>{r.phone && <p className="text-xs text-muted-foreground">{r.phone}</p>}</td>
                  <td className="p-3 text-right">{r.referrals}</td>
                  <td className="p-3 text-right">{r.leads} ({r.won})</td>
                  <td className="p-3 text-right font-semibold">{formatMoney(r.earned)}</td>
                  <td className="p-3 text-right">{formatMoney(r.pending)}</td>
                  <td className="p-3 text-right">{formatMoney(r.marketing)}</td>
                  <td className={`p-3 text-right font-semibold ${r.earned - r.marketing < 0 ? "text-destructive" : "text-foreground"}`}>{formatMoney(r.earned - r.marketing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent></Card>
    </div>
  );
};

export default AgentEarnings;
