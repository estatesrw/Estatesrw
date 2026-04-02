import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Building2, Edit, Trash2, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PropertyImageUpload from "@/components/properties/PropertyImageUpload";

const CITIES = ["Kigali", "Musanze", "Rubavu", "Huye", "Gisenyi", "Butare", "Nyanza", "Rusizi", "Karongi", "Muhanga"];
const PROPERTY_TYPES = [
  { value: "hotel", label: "Hotel" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "guesthouse", label: "Guest House" },
  { value: "house", label: "House" },
  { value: "studio", label: "Studio" },
];

const VendorProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [unitCounts, setUnitCounts] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", property_type: "hotel", address: "", city: "Kigali",
    country: "Rwanda", price: 0, bedrooms: 1, bathrooms: 1, latitude: "", longitude: "",
    uploadedImages: [] as string[],
  });

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    const { data } = await supabase.from("properties").select("*").eq("landlord_id", user.id).order("created_at", { ascending: false });
    const props = data || [];
    setProperties(props);

    // Fetch unit counts per property
    if (props.length > 0) {
      const propIds = props.map(p => p.id);
      const { data: rooms } = await supabase.from("room_types").select("property_id").in("property_id", propIds);
      const counts: Record<string, number> = {};
      rooms?.forEach(r => { counts[r.property_id] = (counts[r.property_id] || 0) + 1; });
      setUnitCounts(counts);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  const resetForm = () => setForm({
    title: "", description: "", property_type: "hotel", address: "", city: "Kigali",
    country: "Rwanda", price: 0, bedrooms: 1, bathrooms: 1, latitude: "", longitude: "",
    uploadedImages: [],
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const payload = {
      title: form.title, description: form.description, property_type: form.property_type,
      address: form.address, city: form.city, country: form.country, price: form.price,
      bedrooms: form.bedrooms, bathrooms: form.bathrooms, landlord_id: user.id, status: "active",
      images: form.uploadedImages,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };

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
    resetForm();
    fetchData();
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      title: p.title, description: p.description || "", property_type: p.property_type,
      address: p.address, city: p.city, country: p.country || "Rwanda", price: p.price,
      bedrooms: p.bedrooms || 1, bathrooms: p.bathrooms || 1,
      latitude: p.latitude?.toString() || "", longitude: p.longitude?.toString() || "",
      uploadedImages: p.images || [],
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-muted-foreground">Manage your accommodation listings</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditId(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editId ? "Edit Property" : "Add Property"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Property Name *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Kigali Marriott Hotel" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of your property..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Base Price/Night ($)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Street address" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })} min={0} />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })} min={0} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} placeholder="-1.9403" />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} placeholder="29.8739" />
                </div>
              </div>
              <PropertyImageUpload
                userId={user!.id}
                images={form.uploadedImages}
                onChange={(imgs) => setForm({ ...form, uploadedImages: imgs })}
              />
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Property</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {properties.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p className="font-medium">No properties yet</p>
            <p className="text-sm mt-1">Add your first hotel or apartment to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.map((p) => (
            <Card key={p.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="p-5 space-y-3">
                {p.images && p.images.length > 0 && (
                  <div className="aspect-video overflow-hidden rounded-md -mx-5 -mt-5 mb-3">
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between">
                   <div className="space-y-1 min-w-0 flex-1">
                     <h3 className="font-display font-semibold text-foreground truncate">{p.title}</h3>
                    <p className="text-xs text-muted-foreground">{p.address}, {p.city}</p>
                  </div>
                  <Badge className={p.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>{p.status}</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-normal">{p.property_type}</Badge>
                  <span>${Number(p.price).toLocaleString()}/night</span>
                  <span>{p.bedrooms} bed · {p.bathrooms} bath</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <BedDouble className="w-3.5 h-3.5 text-primary" />
                  <span className="text-muted-foreground">{unitCounts[p.id] || 0} unit(s) / room types</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/dashboard/vendor/rooms?property=${p.id}`)}>
                    <BedDouble className="w-3.5 h-3.5 mr-1.5" /> Units
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Edit className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
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
