import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, Edit, Trash2 } from "lucide-react";

const VendorProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", property_type: "hotel", address: "", city: "Kigali", price: 0, bedrooms: 1, bathrooms: 1 });

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    const { data } = await supabase.from("properties").select("*").eq("landlord_id", user.id).order("created_at", { ascending: false });
    setProperties(data || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = { ...form, landlord_id: user.id, status: "active" };

    if (editId) {
      const { error } = await supabase.from("properties").update(payload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Property updated" });
    } else {
      const { error } = await supabase.from("properties").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Property added" });
    }
    setDialogOpen(false);
    setEditId(null);
    setForm({ title: "", description: "", property_type: "hotel", address: "", city: "Kigali", price: 0, bedrooms: 1, bathrooms: 1 });
    fetchData();
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({ title: p.title, description: p.description || "", property_type: p.property_type, address: p.address, city: p.city, price: p.price, bedrooms: p.bedrooms || 1, bathrooms: p.bathrooms || 1 });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("properties").delete().eq("id", id);
    toast({ title: "Property deleted" });
    fetchData();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Please register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-muted-foreground">Manage your accommodation listings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); setForm({ title: "", description: "", property_type: "hotel", address: "", city: "Kigali", price: 0, bedrooms: 1, bathrooms: 1 }); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editId ? "Edit Property" : "Add Property"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="guesthouse">Guest House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price/Night ($)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kigali">Kigali</SelectItem>
                      <SelectItem value="Musanze">Musanze</SelectItem>
                      <SelectItem value="Rubavu">Rubavu</SelectItem>
                      <SelectItem value="Huye">Huye</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} min={0} />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Property</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {properties.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground"><Building2 className="w-12 h-12 mx-auto mb-4 text-primary/30" />No properties yet. Add your first listing!</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {properties.map((p) => (
            <Card key={p.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{p.title}</p>
                    <Badge className="bg-primary/10 text-primary">{p.property_type}</Badge>
                    <Badge className={p.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{p.address}, {p.city} · ${Number(p.price).toLocaleString()}/night</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorProperties;
