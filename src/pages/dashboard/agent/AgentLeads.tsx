import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Phone, Mail, Trash2, Pencil, Users } from "lucide-react";
import { formatMoney } from "@/lib/unitStatus";

export const LEAD_STAGES = ["new", "contacted", "viewing", "negotiating", "won", "lost"] as const;
const STAGE_LABEL: Record<string, string> = { new: "New", contacted: "Contacted", viewing: "Viewing", negotiating: "Negotiating", won: "Won", lost: "Lost" };
const INTEREST_LABEL: Record<string, string> = { rent: "Wants to rent", buy: "Wants to buy", sell: "Wants to sell", manage: "Needs management" };

const empty = { name: "", email: "", phone: "", interest: "rent", budget: "", stage: "new", notes: "" };

const AgentLeads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("agent_leads").select("*").eq("agent_id", user!.id).order("created_at", { ascending: false });
    setLeads(data || []);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim().slice(0, 150), email: form.email.trim().slice(0, 255) || null,
      phone: form.phone.trim().slice(0, 40) || null, interest: form.interest, stage: form.stage,
      budget: Math.max(0, Number(form.budget) || 0), notes: form.notes.slice(0, 2000) || null,
    };
    const { error } = editId
      ? await supabase.from("agent_leads").update(payload).eq("id", editId)
      : await supabase.from("agent_leads").insert({ ...payload, agent_id: user!.id });
    setSaving(false);
    if (error) return toast({ title: "Couldn't save lead", description: error.message, variant: "destructive" });
    toast({ title: editId ? "Lead updated" : "Lead added" });
    setOpen(false); load();
  };

  const moveStage = async (id: string, stage: string) => {
    const { error } = await supabase.from("agent_leads").update({ stage }).eq("id", id);
    if (error) return toast({ title: "Couldn't update", description: error.message, variant: "destructive" });
    setLeads((l) => l.map((x) => (x.id === id ? { ...x, stage } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await supabase.from("agent_leads").delete().eq("id", id);
    load();
  };

  const edit = (l: any) => {
    setForm({ name: l.name, email: l.email || "", phone: l.phone || "", interest: l.interest, budget: String(l.budget || ""), stage: l.stage, notes: l.notes || "" });
    setEditId(l.id); setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Leads</h2>
          <p className="text-muted-foreground text-sm">Track people interested in renting, buying, selling or management.</p>
        </div>
        <Button onClick={() => { setForm(empty); setEditId(null); setOpen(true); }}><Plus className="w-4 h-4 mr-2" />Add lead</Button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {LEAD_STAGES.map((s) => (
          <div key={s} className="rounded-2xl border border-border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">{STAGE_LABEL[s]}</p>
            <p className="text-xl font-semibold">{leads.filter((l) => l.stage === s).length}</p>
          </div>
        ))}
      </div>

      {leads.length === 0 ? (
        <Card><CardContent className="p-12 text-center space-y-3">
          <Users className="w-10 h-10 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No leads yet. Add the first person you're talking to.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <Card key={l.id}><CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-3 justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-foreground">{l.name}</p>
                  <Badge variant="secondary">{INTEREST_LABEL[l.interest]}</Badge>
                  {Number(l.budget) > 0 && <span className="text-xs text-muted-foreground">Budget {formatMoney(Number(l.budget))}</span>}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                  {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{l.phone}</a>}
                  {l.email && <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{l.email}</a>}
                </div>
                {l.notes && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{l.notes}</p>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Select value={l.stage} onValueChange={(v) => moveStage(l.id, v)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>{LEAD_STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}</SelectContent>
                </Select>
                <Button size="icon" variant="ghost" onClick={() => edit(l)} aria-label="Edit lead"><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => remove(l.id)} aria-label="Delete lead"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit lead" : "Add lead"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div className="space-y-1"><Label>Name</Label><Input value={form.name} maxLength={150} onChange={(e) => set("name", e.target.value)} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} maxLength={40} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} maxLength={255} onChange={(e) => set("email", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label>Interest</Label>
                <Select value={form.interest} onValueChange={(v) => set("interest", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(INTEREST_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Stage</Label>
                <Select value={form.stage} onValueChange={(v) => set("stage", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LEAD_STAGES.map((s) => <SelectItem key={s} value={s}>{STAGE_LABEL[s]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Budget (RWF)</Label><Input type="number" min="0" value={form.budget} onChange={(e) => set("budget", e.target.value)} /></div>
            </div>
            <div className="space-y-1"><Label>Notes</Label><Textarea rows={3} maxLength={2000} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save lead"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentLeads;
