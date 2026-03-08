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
import { Plus, BedDouble, Edit, Trash2, Calendar } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

const VendorRoomTypes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyFilter = searchParams.get("property") || "all";

  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState(propertyFilter);
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

    let q = supabase.from("room_types").select("*, properties(title)").eq("vendor_id", v.id).order("created_at", { ascending: false });
    if (selectedProperty !== "all") q = q.eq("property_id", selectedProperty);
    const { data: rooms } = await q;
    setRoomTypes(rooms || []);

    // Get active booking counts per room type
    if (rooms && rooms.length > 0) {
      const roomIds = rooms.map(r => r.id);
      const { data: bookings } = await supabase.from("accommodation_bookings")
        .select("room_type_id").in("room_type_id", roomIds).in("status", ["confirmed", "pending"]);
      const counts: Record<string, number> = {};
      bookings?.forEach(b => { counts[b.room_type_id] = (counts[b.room_type_id] || 0) + 1; });
      setBookingCounts(counts);
    }
  };

  useEffect(() => { fetchData(); }, [user, selectedProperty]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;
    const payload = {
      ...form, vendor_id: vendor.id,
      weekend_price: form.weekend_price || null,
      monthly_price: form.monthly_price || null,
    };
    if (editId) {
      const { error } = await supabase.from("room_types").update(payload).eq("id", editId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Unit updated" });
    } else {
      const { error } = await supabase.from("room_types").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Unit added" });
    }
    setDialogOpen(false); setEditId(null);
    setForm({ property_id: "", name: "", description: "", max_guests: 2, total_rooms: 1, price_per_night: 0, weekend_price: 0, monthly_price: 0, minimum_stay: 1 });
    fetchData();
  };

  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({
      property_id: r.property_id, name: r.name, description: r.description || "",
      max_guests: r.max_guests, total_rooms: r.total_rooms, price_per_night: r.price_per_night,
      weekend_price: r.weekend_price || 0, monthly_price: r.monthly_price || 0, minimum_stay: r.minimum_stay,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("room_types").delete().eq("id", id);
    toast({ title: "Unit deleted" }); fetchData();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Units / Room Types</h2>
          <p className="text-muted-foreground">Define room categories, capacity, and pricing per property</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditId(null); }}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Unit</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editId ? "Edit" : "Add"} Unit / Room Type</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Property *</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unit Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Deluxe Suite" />
                </div>
                <div className="space-y-2">
                  <Label>Max Guests</Label>
                  <Input type="number" value={form.max_guests} onChange={(e) => setForm({ ...form, max_guests: Number(e.target.value) })} min={1} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Room features and amenities..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Price/Night ($) *</Label><Input type="number" value={form.price_per_night} onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })} min={0} /></div>
                <div className="space-y-2"><Label>Weekend ($)</Label><Input type="number" value={form.weekend_price} onChange={(e) => setForm({ ...form, weekend_price: Number(e.target.value) })} min={0} /></div>
                <div className="space-y-2"><Label>Monthly ($)</Label><Input type="number" value={form.monthly_price} onChange={(e) => setForm({ ...form, monthly_price: Number(e.target.value) })} min={0} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Total Rooms</Label><Input type="number" value={form.total_rooms} onChange={(e) => setForm({ ...form, total_rooms: Number(e.target.value) })} min={1} /></div>
                <div className="space-y-2"><Label>Min Stay (nights)</Label><Input type="number" value={form.minimum_stay} onChange={(e) => setForm({ ...form, minimum_stay: Number(e.target.value) })} min={1} /></div>
              </div>
              <Button type="submit" className="w-full">{editId ? "Update" : "Add"} Unit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Property filter */}
      <Select value={selectedProperty} onValueChange={setSelectedProperty}>
        <SelectTrigger className="w-56"><SelectValue placeholder="All Properties" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
        </SelectContent>
      </Select>

      {roomTypes.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <BedDouble className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p className="font-medium">No units yet</p>
            <p className="text-sm mt-1">Add room types to your properties to start managing availability.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roomTypes.map((r) => (
            <Card key={r.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-foreground">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{(r as any).properties?.title}</p>
                  </div>
                  <Badge className={r.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>{r.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground">${r.price_per_night}</p>
                    <p className="text-[10px] text-muted-foreground">Per Night</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground">{r.max_guests}</p>
                    <p className="text-[10px] text-muted-foreground">Max Guests</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold text-foreground">{r.total_rooms}</p>
                    <p className="text-[10px] text-muted-foreground">Rooms</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Min stay: {r.minimum_stay} night(s)</p>
                  {r.weekend_price && <p>Weekend: ${r.weekend_price}/night</p>}
                  {r.monthly_price && <p>Monthly: ${r.monthly_price}</p>}
                </div>
                {(bookingCounts[r.id] || 0) > 0 && (
                  <Badge variant="outline" className="text-xs">{bookingCounts[r.id]} active booking(s)</Badge>
                )}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/dashboard/vendor/calendar?unit=${r.id}`)}>
                    <Calendar className="w-3.5 h-3.5 mr-1.5" /> Calendar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEdit(r)}><Edit className="w-3.5 h-3.5" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(r.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5" /></Button>
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
