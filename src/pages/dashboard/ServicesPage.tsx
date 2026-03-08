import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyImageUpload from "@/components/properties/PropertyImageUpload";

const categories = [
  { value: "property_management", label: "Property Management" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "landscaping", label: "Landscaping" },
  { value: "security", label: "Security Services" },
  { value: "moving", label: "Moving Services" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "painting", label: "Painting" },
  { value: "general", label: "General" },
];

const ServicesPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isProvider = roles.includes("service_provider");
  const isAdmin = roles.includes("admin");
  const [services, setServices] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "general", price: "", price_type: "fixed", city: "Kigali", image_url: "",
  });

  const fetchServices = async () => {
    let query = supabase.from("services").select("*").order("created_at", { ascending: false });
    if (isProvider && !isAdmin) query = query.eq("provider_id", user!.id);
    const { data } = await query;
    setServices(data || []);
  };

  useEffect(() => { if (user) fetchServices(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", description: "", category: "general", price: "", price_type: "fixed", city: "Kigali", image_url: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), provider_id: user!.id };
    let error;
    if (editingId) {
      ({ error } = await supabase.from("services").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("services").insert(payload));
    }
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Service updated" : "Service added" });
      setDialogOpen(false);
      resetForm();
      fetchServices();
    }
  };

  const handleEdit = (s: any) => {
    setForm({
      title: s.title, description: s.description || "", category: s.category,
      price: String(s.price), price_type: s.price_type, city: s.city, image_url: s.image_url || "",
    });
    setEditingId(s.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Service deleted" }); fetchServices(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Services</h2>
          <p className="text-muted-foreground">Manage your service offerings</p>
        </div>
        {isProvider && (
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Service</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display">{editingId ? "Edit Service" : "Add New Service"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Service Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Professional Deep Cleaning" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your service in detail..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Price (RWF)</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price Type</Label>
                    <Select value={form.price_type} onValueChange={(v) => setForm({ ...form, price_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                        <SelectItem value="hourly">Per Hour</SelectItem>
                        <SelectItem value="daily">Per Day</SelectItem>
                        <SelectItem value="negotiable">Negotiable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Image URL (optional)</Label>
                  <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                </div>
                <Button type="submit" className="w-full">{editingId ? "Update" : "Add"} Service</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {services.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">
          {isProvider ? "You haven't added any services yet. Click 'Add Service' to get started!" : "No services found."}
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
              {s.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {categories.find((c) => c.value === s.category)?.label || s.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-primary text-primary" />{Number(s.rating).toFixed(1)}
                  </div>
                </div>
                <h3 className="font-display font-semibold text-foreground mt-2">{s.title}</h3>
                {s.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{s.city}</p>
                <p className="text-xl font-bold text-foreground mt-3">
                  RWF {Number(s.price).toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    {s.price_type === "hourly" ? "/hr" : s.price_type === "daily" ? "/day" : s.price_type === "negotiable" ? " (negotiable)" : ""}
                  </span>
                </p>
                {isProvider && s.provider_id === user?.id && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(s)}><Pencil className="w-3 h-3 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
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

export default ServicesPage;
