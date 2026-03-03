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
import { Plus, BedDouble, Edit, Trash2 } from "lucide-react";

const VendorRoomTypes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    property_id: "", name: "", description: "", max_guests: 2, total_rooms: 1,
    price_per_night: 0, weekend_price: 0, monthly_price: 0, minimum_stay: 1,
  });

  const fetchData = async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);
    const { data: props } = await supabase.from("properties").select("id, title").eq("landlord_id", user.id);
    setProperties(props || []);
    const { data: rooms } = await supabase.from("room_types").select("*, properties(title)").eq("vendor_id", v.id).order("created_at", { ascending: false });
    setRoomTypes(rooms || []);
  };

  useEffect(() => { fetchData(); }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    const payload = { ...form, vendor_id: vendor.id, weekend_price: form.weekend_price || null, monthly_price: form.monthly_price || null };
    if (editId) {
      const { error } = await supabase.from("room_types").update(payload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Room type updated" });
    } else {
      const { error } = await supabase.from("room_types").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Room type added" });
    }
    setDialogOpen(false); setEditId(null); fetchData();
  };

  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({ property_id: r.property_id, name: r.name, description: r.description || "", max_guests: r.max_guests, total_rooms: r.total_rooms, price_per_night: r.price_per_night, weekend_price: r.weekend_price || 0, monthly_price: r.monthly_price || 0, minimum_stay: r.minimum_stay });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("room_types").delete().eq("id", id);
    toast({ title: "Room type deleted" }); fetchData();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Room Types</h2>
          <p className="text-muted-foreground">Define room categories and pricing</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditId(null); }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Room Type</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editId ? "Edit" : "Add"} Room Type</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Property *</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Deluxe Suite" /></div>
                <div className="space-y-2"><Label>Max Guests</Label><Input type="number" value={form.max_guests} onChange={(e) => setForm({ ...form, max_guests: Number(e.target.value) })} min={1} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Price/Night ($) *</Label><Input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })} min={0} /></div>
                <div className="space-y-2"><Label>Weekend ($)</Label><Input type="number" value={form.weekend_price} onChange={(e) => setForm({ ...form, weekend_price: Number(e.target.value) })} min={0} /></div>
                <div className="space-y-2"><Label>Monthly ($)</Label><Input type="number" value={form.monthly_price} onChange={(e) => setForm({ ...form, monthly_price: Number(e.target.value) })} min={0} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Total Rooms</Label><Input type="number" value={form.total_rooms} onChange={(e) => setForm({ ...form, total_rooms: Number(e.target.value) })} min={1} /></div>
                <div className="space-y-2"><Label>Min Stay (nights)</Label><Input type="number" value={form.minimum_stay} onChange={(e) => setForm({ ...form, minimum_stay: Number(e.target.value) })} min={1} /></div>
              </div>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Room Type</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {roomTypes.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground"><BedDouble className="w-12 h-12 mx-auto mb-4 text-primary/30" />No room types yet.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {roomTypes.map((r) => (
            <Card key={r.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{r.name}</p>
                    <Badge className="bg-primary/10 text-primary">{(r as any).properties?.title}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">${r.price_per_night}/night · {r.max_guests} guests · {r.total_rooms} rooms · Min {r.minimum_stay} night(s)</p>
                  {r.weekend_price && <p className="text-xs text-muted-foreground">Weekend: ${r.weekend_price}/night</p>}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(r)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorRoomTypes;
