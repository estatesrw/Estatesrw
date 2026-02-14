import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Bed, Bath, Maximize, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertiesPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isLandlord = roles.includes("landlord");
  const isAdmin = roles.includes("admin");
  const [properties, setProperties] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", property_type: "apartment", address: "", city: "",
    price: "", bedrooms: "0", bathrooms: "0", area: "0", image_url: "",
  });

  const fetchProperties = async () => {
    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (isLandlord && !isAdmin) query = query.eq("landlord_id", user!.id);
    const { data } = await query;
    setProperties(data || []);
  };

  useEffect(() => { if (user) fetchProperties(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", description: "", property_type: "apartment", address: "", city: "", price: "", bedrooms: "0", bathrooms: "0", area: "0", image_url: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      property_type: form.property_type,
      address: form.address,
      city: form.city,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      images: form.image_url ? [form.image_url] : [],
      landlord_id: user!.id,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("properties").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("properties").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Property updated" : "Property added" });
      setDialogOpen(false);
      resetForm();
      fetchProperties();
    }
  };

  const handleEdit = (p: any) => {
    setForm({
      title: p.title, description: p.description || "", property_type: p.property_type,
      address: p.address, city: p.city, price: String(p.price),
      bedrooms: String(p.bedrooms), bathrooms: String(p.bathrooms), area: String(p.area),
      image_url: p.images?.[0] || "",
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Property deleted" }); fetchProperties(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-muted-foreground">{isLandlord ? "Manage your property listings" : "All platform properties"}</p>
        </div>
        {isLandlord && (
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Property</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editingId ? "Edit Property" : "Add New Property"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($/month)</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Area (sqft)</Label>
                    <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL (optional)</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.unsplash.com/..." />
                </div>
                <Button type="submit" className="w-full">{editingId ? "Update" : "Add"} Property</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {properties.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No properties found.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <Card key={p.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
              {p.images && p.images.length > 0 && (
                <div className="aspect-video overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{p.city}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>{p.status}</span>
                </div>
                <p className="text-xl font-bold text-foreground mb-3">${Number(p.price).toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms} bed</span>
                  <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} bath</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area} sqft</span>
                </div>
                {isLandlord && p.landlord_id === user?.id && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}><Pencil className="w-3 h-3 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
