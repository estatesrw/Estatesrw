import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatsCard from "@/components/dashboard/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Trash2, Wallet, TrendingUp } from "lucide-react";
import { formatMoney } from "@/lib/unitStatus";

export const CHANNEL_LABEL: Record<string, string> = {
  facebook: "Facebook", instagram: "Instagram", whatsapp: "WhatsApp", google: "Google", print: "Flyers / print", event: "Event / open house", other: "Other",
};

const AgentMarketing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [costs, setCosts] = useState<any[]>([]);
  const [earned, setEarned] = useState(0);
  const [form, setForm] = useState({ description: "", channel: "facebook", amount: "", spent_on: new Date().toISOString().slice(0, 10) });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [c, r] = await Promise.all([
      supabase.from("agent_marketing_costs").select("*").eq("agent_id", user!.id).order("spent_on", { ascending: false }),
      supabase.from("agent_referrals").select("commission_amount, status").eq("agent_id", user!.id),
    ]);
    setCosts(c.data || []);
    setEarned((r.data || []).filter((x) => x.status === "completed").reduce((s, x) => s + Number(x.commission_amount), 0));
  };
  useEffect(() => { if (user) load(); }, [user]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.description.trim() || !(amount > 0)) return toast({ title: "Add a description and an amount above 0", variant: "destructive" });
    setSaving(true);
    const { error } = await supabase.from("agent_marketing_costs").insert({
      agent_id: user!.id, description: form.description.trim().slice(0, 300), channel: form.channel, amount, spent_on: form.spent_on,
    });
    setSaving(false);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    setForm((f) => ({ ...f, description: "", amount: "" }));
    toast({ title: "Expense added" });
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("agent_marketing_costs").delete().eq("id", id);
    load();
  };

  const total = costs.reduce((s, c) => s + Number(c.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Marketing costs</h2>
        <p className="text-muted-foreground text-sm">Record what you spend on ads, flyers and events to see your real profit.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total spent" value={formatMoney(total)} icon={<Megaphone className="w-5 h-5" />} />
        <StatsCard title="Commission earned" value={formatMoney(earned)} icon={<Wallet className="w-5 h-5" />} variant="primary" />
        <StatsCard title="Net profit" value={formatMoney(earned - total)} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <Card><CardContent className="p-4">
        <form onSubmit={add} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto] items-end">
          <div className="space-y-1"><Label>What was it for?</Label><Input value={form.description} maxLength={300} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Facebook ad for Kibagabaga house" /></div>
          <div className="space-y-1"><Label>Channel</Label>
            <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(CHANNEL_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Amount (RWF)</Label><Input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.spent_on} onChange={(e) => setForm({ ...form, spent_on: e.target.value })} /></div>
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Add"}</Button>
        </form>
      </CardContent></Card>

      {costs.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">No expenses recorded yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {costs.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-card">
              <div>
                <p className="text-sm font-medium text-foreground">{c.description}</p>
                <p className="text-xs text-muted-foreground">{CHANNEL_LABEL[c.channel]} · {new Date(c.spent_on).toLocaleDateString("en-GB")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{formatMoney(Number(c.amount))}</span>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(c.id)} aria-label="Delete expense"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentMarketing;
