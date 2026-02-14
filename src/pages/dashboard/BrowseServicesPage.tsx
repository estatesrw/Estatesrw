import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star, MapPin, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "property_management", label: "Property Management" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "repairs", label: "Repairs & Maintenance" },
  { value: "landscaping", label: "Landscaping" },
  { value: "security", label: "Security Services" },
  { value: "moving", label: "Moving Services" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "painting", label: "Painting" },
];

const BrowseServicesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [bookDialog, setBookDialog] = useState<any>(null);
  const [bookForm, setBookForm] = useState({ scheduled_date: "", scheduled_time: "", notes: "" });

  useEffect(() => {
    const fetchServices = async () => {
      let query = supabase.from("services").select("*").eq("status", "active").order("rating", { ascending: false });
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`);
      if (categoryFilter !== "all") query = query.eq("category", categoryFilter);
      const { data } = await query;
      setServices(data || []);
    };
    fetchServices();
  }, [search, categoryFilter]);

  const handleBook = async () => {
    if (!bookDialog || !user) return;
    const { error } = await supabase.from("service_bookings").insert({
      service_id: bookDialog.id,
      customer_id: user.id,
      provider_id: bookDialog.provider_id,
      scheduled_date: bookForm.scheduled_date,
      scheduled_time: bookForm.scheduled_time,
      notes: bookForm.notes,
      total_price: bookDialog.price,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Service booked successfully!" });
      setBookDialog(null);
      setBookForm({ scheduled_date: "", scheduled_time: "", notes: "" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Services Marketplace</h2>
        <p className="text-muted-foreground">Find and book professional services for your property</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {services.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No services available matching your criteria.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
              {s.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={s.image_url} alt={s.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {categories.find((c) => c.value === s.category)?.label || s.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="font-medium">{Number(s.rating).toFixed(1)}</span>
                    <span className="text-muted-foreground">({s.total_reviews})</span>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-foreground mt-2">{s.title}</h3>
                {s.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>}
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{s.city}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-bold text-foreground">
                    RWF {Number(s.price).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {s.price_type === "hourly" ? "/hr" : s.price_type === "daily" ? "/day" : ""}
                    </span>
                  </p>
                  <Button size="sm" onClick={() => setBookDialog(s)}>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!bookDialog} onOpenChange={(o) => { if (!o) { setBookDialog(null); setBookForm({ scheduled_date: "", scheduled_time: "", notes: "" }); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Book: {bookDialog?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-lg font-bold text-foreground">RWF {Number(bookDialog?.price || 0).toLocaleString()}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" />Preferred Date</label>
              <Input type="date" value={bookForm.scheduled_date} onChange={(e) => setBookForm({ ...bookForm, scheduled_date: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2"><Clock className="w-4 h-4" />Preferred Time</label>
              <Input type="time" value={bookForm.scheduled_time} onChange={(e) => setBookForm({ ...bookForm, scheduled_time: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Notes</label>
              <Textarea value={bookForm.notes} onChange={(e) => setBookForm({ ...bookForm, notes: e.target.value })} placeholder="Any special requirements..." />
            </div>
            <Button onClick={handleBook} className="w-full" disabled={!bookForm.scheduled_date}>Confirm Booking</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseServicesPage;
