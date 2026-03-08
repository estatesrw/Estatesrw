import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Bed, Bath, Maximize, Search, Send, Eye, SlidersHorizontal, X, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CITIES = ["Kigali", "Musanze", "Rubavu", "Huye", "Rusizi", "Muhanga", "Nyagatare", "Rwamagana"];
const PROPERTY_TYPES = ["apartment", "house", "hotel", "guesthouse", "villa", "commercial", "land"];
const AMENITIES = ["WiFi", "Parking", "Pool", "Gym", "Security", "Generator", "Garden", "AC", "Hot Water", "Kitchen", "Laundry", "TV"];

const BrowseProperties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [applyDialog, setApplyDialog] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      let query = supabase.from("properties").select("*").eq("status", "active").order("created_at", { ascending: false });
      if (search) query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,address.ilike.%${search}%`);
      if (typeFilter !== "all") query = query.eq("property_type", typeFilter);
      if (cityFilter !== "all") query = query.eq("city", cityFilter);
      if (priceRange[0] > 0) query = query.gte("price", priceRange[0]);
      if (priceRange[1] < 5000000) query = query.lte("price", priceRange[1]);
      
      const { data } = await query;
      let result = data || [];
      
      // Client-side amenity filter
      if (amenityFilters.length > 0) {
        result = result.filter(p => 
          amenityFilters.every(a => (p.amenities || []).some((pa: string) => pa.toLowerCase().includes(a.toLowerCase())))
        );
      }
      
      setProperties(result);
      setLoading(false);
    };
    fetchProperties();
  }, [search, typeFilter, cityFilter, priceRange, amenityFilters]);

  // Fetch saved properties
  useEffect(() => {
    if (!user) return;
    supabase.from("saved_properties").select("property_id").eq("user_id", user.id)
      .then(({ data }) => setSavedIds(new Set((data || []).map(s => s.property_id))));
  }, [user]);

  const toggleSave = async (propertyId: string) => {
    if (!user) return;
    if (savedIds.has(propertyId)) {
      await supabase.from("saved_properties").delete().eq("user_id", user.id).eq("property_id", propertyId);
      setSavedIds(prev => { const n = new Set(prev); n.delete(propertyId); return n; });
    } else {
      await supabase.from("saved_properties").insert({ user_id: user.id, property_id: propertyId });
      setSavedIds(prev => new Set(prev).add(propertyId));
    }
  };

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

  const toggleAmenity = (a: string) => {
    setAmenityFilters(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  };

  const activeFilterCount = [typeFilter !== "all", cityFilter !== "all", priceRange[0] > 0 || priceRange[1] < 5000000, amenityFilters.length > 0].filter(Boolean).length;

  const clearFilters = () => {
    setTypeFilter("all");
    setCityFilter("all");
    setPriceRange([0, 5000000]);
    setAmenityFilters([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Browse Properties</h2>
        <p className="text-muted-foreground">Discover your perfect accommodation in Rwanda</p>
      </div>

      {/* Search bar + filter toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name, city, address..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced filters panel */}
      {showFilters && (
        <Card className="shadow-card animate-fade-up">
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Location</Label>
                <Select value={cityFilter} onValueChange={setCityFilter}>
                  <SelectTrigger><SelectValue placeholder="All cities" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Property Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {PROPERTY_TYPES.map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs">Price Range: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} RWF</Label>
                <Slider
                  min={0}
                  max={5000000}
                  step={50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(a => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      amenityFilters.includes(a)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Searching..." : `${properties.length} properties found`}
        </p>
        {activeFilterCount > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {typeFilter !== "all" && (
              <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setTypeFilter("all")}>
                {typeFilter} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {cityFilter !== "all" && (
              <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setCityFilter("all")}>
                {cityFilter} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {amenityFilters.map(a => (
              <Badge key={a} variant="outline" className="text-xs cursor-pointer" onClick={() => toggleAmenity(a)}>
                {a} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Property grid */}
      {properties.length === 0 && !loading ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No properties found matching your criteria.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <Card key={p.id} className="shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group">
              <div className="relative aspect-video overflow-hidden">
                {p.images && p.images.length > 0 ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
                <button
                  onClick={() => toggleSave(p.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    savedIds.has(p.id) ? "bg-destructive text-destructive-foreground" : "bg-card/80 text-muted-foreground hover:bg-card"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${savedIds.has(p.id) ? "fill-current" : ""}`} />
                </button>
                <Badge className="absolute top-3 left-3 bg-card/90 text-foreground text-xs">{p.property_type}</Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{p.address}, {p.city}</p>
                {p.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>}
                <p className="text-xl font-bold text-foreground mb-2">
                  {Number(p.price).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">RWF/mo</span>
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                  {p.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms}</span>}
                  {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                  {p.area > 0 && <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area}m²</span>}
                </div>
                {(p.amenities || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(p.amenities as string[]).slice(0, 4).map(a => (
                      <Badge key={a} variant="outline" className="text-[10px] px-1.5 py-0">{a}</Badge>
                    ))}
                    {(p.amenities as string[]).length > 4 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{(p.amenities as string[]).length - 4}</Badge>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/dashboard/property/${p.id}`)}>
                    <Eye className="w-4 h-4 mr-1" />Details
                  </Button>
                  <Button className="flex-1" onClick={() => setApplyDialog(p)}>
                    <Send className="w-4 h-4 mr-1" />Apply
                  </Button>
                </div>
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
              <label className="text-sm font-medium">Message (optional)</label>
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
