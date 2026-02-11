import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MaintenancePage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isLandlord = roles.includes("landlord");
  const [tickets, setTickets] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [form, setForm] = useState({ property_id: "", title: "", description: "", priority: "medium" });

  const fetchTickets = async () => {
    if (!user) return;
    const { data } = await supabase.from("maintenance_tickets").select("*, properties(title, city)").order("created_at", { ascending: false });
    setTickets(data || []);
  };

  const fetchProperties = async () => {
    if (!user) return;
    // Tenants see properties they have bookings for, landlords see their own
    if (isLandlord) {
      const { data } = await supabase.from("properties").select("id, title").eq("landlord_id", user.id);
      setProperties(data || []);
    } else {
      const { data } = await supabase.from("bookings").select("property_id, properties(id, title)").eq("tenant_id", user.id).eq("status", "active");
      setProperties(data?.map((b) => (b.properties as any)) || []);
    }
  };

  useEffect(() => { fetchTickets(); fetchProperties(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("maintenance_tickets").insert({
      ...form,
      reported_by: user!.id,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Ticket created" }); setDialogOpen(false); setForm({ property_id: "", title: "", description: "", priority: "medium" }); fetchTickets(); }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("maintenance_tickets").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Status updated" }); fetchTickets(); }
  };

  const priorityColor = (p: string) => {
    switch (p) { case "high": return "bg-destructive/10 text-destructive"; case "low": return "bg-muted text-muted-foreground"; default: return "bg-accent/20 text-accent-foreground"; }
  };
  const statusColor = (s: string) => {
    switch (s) { case "resolved": return "bg-primary/10 text-primary"; case "in_progress": return "bg-accent/20 text-accent-foreground"; default: return "bg-muted text-muted-foreground"; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Maintenance</h2>
          <p className="text-muted-foreground">Report and track maintenance issues</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />New Ticket</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Report an Issue</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Property</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Submit Ticket</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tickets.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No maintenance tickets found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-foreground">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{(t.properties as any)?.title} · {new Date(t.created_at).toLocaleDateString()}</p>
                  {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={priorityColor(t.priority)}>{t.priority}</Badge>
                  <Badge className={statusColor(t.status)}>{t.status}</Badge>
                  {isLandlord && t.status !== "resolved" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(t.id, t.status === "open" ? "in_progress" : "resolved")}>
                      {t.status === "open" ? "Start" : "Resolve"}
                    </Button>
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

export default MaintenancePage;
