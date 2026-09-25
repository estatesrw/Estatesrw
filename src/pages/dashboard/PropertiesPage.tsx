import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, MapPin, Bed, Bath, Pencil, Trash2, ExternalLink, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyImageUpload from "@/components/properties/PropertyImageUpload";
import AmenitiesPicker from "@/components/properties/AmenitiesPicker";
import { formatPrice, formatDate } from "@/lib/listings";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = () => ({
  title: "", description: "", property_type: "house", listing_type: "sale", currency: "RWF",
  address: "", city: "Kigali", price: "", bedrooms: "0", bathrooms: "0", area: "0",
  status: "active", available_from: today(), listed_at: today(),
  uploadedImages: [] as string[], amenities: [] as string[],
});

const PropertiesPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isAdmin = roles.includes("admin");
  const canManage = isAdmin || roles.includes("landlord");
  const [properties, setProperties] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "sale" | "rent">("all");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());

  const fetchProperties = async () => {
    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("landlord_id", user!.id);
    const { data } = await query;
    setProperties(data || []);
  };

  useEffect(() => { if (user) fetchProperties(); }, [user, isAdmin]);

  const openNew = () => { setForm(emptyForm()); setEditingId(null); setDialogOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.title.trim() || !(price > 0)) {
      toast({ title: "Please add a title and a price above 0", variant: "destructive" }); return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title.trim().slice(0, 200), description: form.description.slice(0, 5000),
      property_type: form.property_type, listing_type: form.listing_type, currency: form.currency,
      address: form.address.trim(), city: form.city.trim(), price,
      bedrooms: Number(form.bedrooms), bathrooms: Number(form.bathrooms), area: Number(form.area),
      status: form.status, available_from: form.available_from || null, listed_at: form.listed_at || null,
      images: form.uploadedImages, amenities: form.amenities,
    };
    const { error } = editingId
      ? await supabase.from("properties").update(payload).eq("id", editingId)
      : await supabase.from("properties").insert({ ...payload, landlord_id: user!.id });
    setSaving(false);
    if (error) return toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
    toast({ title: editingId ? "Listing updated" : "Listing added" });
    setDialogOpen(false);
    fetchProperties();
  };

  const handleEdit = (p: any) => {
    setForm({
      title: p.title, description: p.description || "", property_type: p.property_type,
      listing_type: p.listing_type || "rent", currency: p.currency || "RWF",
      address: p.address, city: p.city, price: String(p.price),
      bedrooms: String(p.bedrooms ?? 0), bathrooms: String(p.bathrooms ?? 0), area: String(p.area ?? 0),
      status: p.status, available_from: p.available_from || "", listed_at: p.listed_at || "",
      uploadedImages: p.images || [], amenities: p.amenities || [],
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("properties").delete().eq("id", deleteId);
    setDeleteId(null);
    if (error) toast({ title: "Couldn't delete", description: error.message, variant: "destructive" });
    else { toast({ title: "Listing deleted" }); fetchProperties(); }
  };

  const shown = properties
    .filter((p) => filter === "all" || p.listing_type === filter)
    .filter((p) => `${p.title} ${p.city} ${p.address}`.toLowerCase().includes(search.toLowerCase()));

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Property Listings</h2>
          <p className="text-muted-foreground">Houses for sale and rent shown on your public pages</p>
        </div>
        {canManage && <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Listing</Button>}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {(["all", "sale", "rent"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${properties.length})` : f === "sale" ? `For Sale (${properties.filter(p => p.listing_type === "sale").length})` : `For Rent (${properties.filter(p => p.listing_type === "rent").length})`}
          </Button>
        ))}
        <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <div className="ml-auto flex gap-3 text-sm">
          <Link to="/houses-for-sale-kigali" target="_blank" className="underline text-primary">Public sale page</Link>
          <Link to="/houses-for-rent-kigali" target="_blank" className="underline text-primary">Public rent page</Link>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display">{editingId ? "Edit Listing" : "Add New Listing"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listing for</Label>
                <Select value={form.listing_type} onValueChange={(v) => set("listing_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sale">Sale</SelectItem><SelectItem value="rent">Rent</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibility</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Published</SelectItem>
                    <SelectItem value="draft">Hidden (draft)</SelectItem>
                    <SelectItem value="sold">Sold / Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} maxLength={200} onChange={(e) => set("title", e.target.value)} required /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea rows={4} value={form.description} maxLength={5000} onChange={(e) => set("description", e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.property_type} onValueChange={(v) => set("property_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem><SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem><SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="RWF">RWF</SelectItem><SelectItem value="USD">USD</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{form.listing_type === "rent" ? "Price / month" : "Sale price"}</Label>
                <Input type="number" min="1" value={form.price} onChange={(e) => set("price", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Address / area</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} required /></div>
              <div className="space-y-2"><Label>City</Label><Input value={form.city} onChange={(e) => set("city", e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Bedrooms</Label><Input type="number" min="0" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)} /></div>
              <div className="space-y-2"><Label>Bathrooms</Label><Input type="number" min="0" value={form.bathrooms} onChange={(e) => set("bathrooms", e.target.value)} /></div>
              <div className="space-y-2"><Label>Size (m²)</Label><Input type="number" min="0" value={form.area} onChange={(e) => set("area", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Available from</Label><Input type="date" value={form.available_from} onChange={(e) => set("available_from", e.target.value)} /></div>
              <div className="space-y-2"><Label>Listed on</Label><Input type="date" value={form.listed_at} onChange={(e) => set("listed_at", e.target.value)} /></div>
            </div>
            <PropertyImageUpload userId={user!.id} images={form.uploadedImages} onChange={(imgs) => set("uploadedImages", imgs)} label="Photos" />
            <AmenitiesPicker selected={form.amenities} onChange={(a) => set("amenities", a)} />
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : editingId ? "Save changes" : "Add listing"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>It will be removed from the public pages permanently.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {shown.length === 0 ? (
        <Card><CardContent className="p-12 text-center text-muted-foreground">No listings yet. Click "Add Listing" to create one.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden relative">
                {p.images?.[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />}
                <Badge className="absolute top-2 left-2">{p.listing_type === "sale" ? "For Sale" : "For Rent"}</Badge>
                {p.status !== "active" && <Badge variant="secondary" className="absolute top-2 right-2">{p.status === "draft" ? "Hidden" : p.status}</Badge>}
              </div>
              <CardContent className="p-5 space-y-2">
                <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.address}, {p.city}</p>
                <p className="text-lg font-bold text-foreground">{formatPrice(p.price, p.currency, p.listing_type)}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms ?? 0}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms ?? 0}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Available {formatDate(p.available_from)}</span>
                </div>
                {(isAdmin || p.landlord_id === user?.id) && (
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(p)}><Pencil className="w-3 h-3 mr-1" />Edit</Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDeleteId(p.id)}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
                    <Button variant="ghost" size="sm" asChild><Link to={`/listing/${p.id}`} target="_blank"><ExternalLink className="w-3 h-3" /></Link></Button>
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
