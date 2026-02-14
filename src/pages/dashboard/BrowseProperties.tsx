import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Bed, Bath, Maximize, Search, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BrowseProperties = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [applyDialog, setApplyDialog] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      let query = supabase.from("properties").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (search) query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%`);
      if (typeFilter !== "all") query = query.eq("property_type", typeFilter);
      const { data } = await query;
      setProperties(data || []);
    };
    fetchProperties();
  }, [search, typeFilter]);

  const handleApply = async () => {
    if (!applyDialog || !user) return;
    const { error } = await supabase.from("applications").insert({
      tenant_id: user.id,
      property_id: applyDialog.id,
      message,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!" });
      setApplyDialog(null);
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Browse Properties</h2>
        <p className="text-muted-foreground">Find your next home</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {properties.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No properties found matching your criteria.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <Card key={p.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden">
              {p.images && p.images.length > 0 && (
                <div className="aspect-video overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{p.address}, {p.city}</p>
                {p.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
                <p className="text-xl font-bold text-foreground mb-3">${Number(p.price).toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms} bed</span>
                  <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} bath</span>
                  <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area} sqft</span>
                </div>
                <Button className="w-full" onClick={() => setApplyDialog(p)}>
                  <Send className="w-4 h-4 mr-2" />Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!applyDialog} onOpenChange={(o) => { if (!o) { setApplyDialog(null); setMessage(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Apply for {applyDialog?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message to landlord (optional)</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell the landlord about yourself..." />
            </div>
            <Button onClick={handleApply} className="w-full">Submit Application</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseProperties;
