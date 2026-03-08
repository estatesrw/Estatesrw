import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Plus } from "lucide-react";

const AgentReferrals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ guest_name: "", guest_email: "", guest_phone: "", property_id: "", notes: "" });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [refRes, propRes] = await Promise.all([
        supabase.from("agent_referrals").select("*, properties(title, city)").eq("agent_id", user.id).order("created_at", { ascending: false }),
        supabase.from("properties").select("id, title, city").eq("status", "active").limit(100),
      ]);
      setReferrals(refRes.data || []);
      setProperties(propRes.data || []);
    };
    load();
  }, [user]);

  const submitReferral = async () => {
    if (!user || !form.guest_name) {
      toast({ title: "Guest name required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("agent_referrals").insert({
      agent_id: user.id,
      guest_name: form.guest_name,
      guest_email: form.guest_email || null,
      guest_phone: form.guest_phone || null,
      property_id: form.property_id || null,
      notes: form.notes || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Referral submitted!" });
      setDialogOpen(false);
      setForm({ guest_name: "", guest_email: "", guest_phone: "", property_id: "", notes: "" });
      const { data } = await supabase.from("agent_referrals").select("*, properties(title, city)").eq("agent_id", user.id).order("created_at", { ascending: false });
      setReferrals(data || []);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Referrals</h2>
          <p className="text-muted-foreground text-sm">Refer guests to properties and earn commissions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Referral</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Submit Guest Referral</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Guest Name *</Label>
                <Input value={form.guest_name} onChange={(e) => setForm(f => ({ ...f, guest_name: e.target.value }))} placeholder="Full name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.guest_email} onChange={(e) => setForm(f => ({ ...f, guest_email: e.target.value }))} placeholder="email@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.guest_phone} onChange={(e) => setForm(f => ({ ...f, guest_phone: e.target.value }))} placeholder="+250..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Property (optional)</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm(f => ({ ...f, property_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No specific property</SelectItem>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title} - {p.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any additional info about the guest..." />
              </div>
              <Button onClick={submitReferral} className="w-full">Submit Referral</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {referrals.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p>No referrals yet. Refer a guest to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {referrals.map((r) => (
            <Card key={r.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{r.guest_name}</p>
                      <Badge className={statusColor(r.status)}>{r.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {r.guest_email && `${r.guest_email} · `}{r.guest_phone}
                    </p>
                    {(r as any).properties?.title && (
                      <p className="text-sm text-muted-foreground">Property: {(r as any).properties?.title}</p>
                    )}
                    {r.notes && <p className="text-xs text-muted-foreground mt-1">{r.notes}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Submitted: {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Commission Rate: {r.commission_rate}%</p>
                    {r.commission_amount > 0 && (
                      <p className="text-lg font-bold text-foreground">${Number(r.commission_amount).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentReferrals;
