import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin, Bed, Bath, Maximize, ArrowLeft, ChevronLeft, ChevronRight,
  Send, Phone, Mail, CheckCircle2, Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<any>(null);
  const [landlord, setLandlord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        toast({ title: "Property not found", variant: "destructive" });
        navigate("/dashboard/browse");
        return;
      }
      setProperty(data);

      // Fetch landlord profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone_number, avatar_url")
        .eq("id", data.landlord_id)
        .maybeSingle();
      setLandlord(profile);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  const handleApply = async () => {
    if (!user || !property) return;
    const { error } = await supabase.from("applications").insert({
      tenant_id: user.id,
      property_id: property.id,
      message,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted successfully!" });
      setApplyOpen(false);
      setMessage("");
    }
  };

  const handleContact = async () => {
    if (!user || !property || !message.trim()) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: property.landlord_id,
      content: message,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent to landlord!" });
      setContactOpen(false);
      setMessage("");
    }
  };

  const images = property?.images?.length > 0 ? property.images : [];
  const nextImage = () => setCurrentImage((i) => (i + 1) % images.length);
  const prevImage = () => setCurrentImage((i) => (i - 1 + images.length) % images.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading property details...
      </div>
    );
  }

  if (!property) return null;

  const isTenant = roles.includes("tenant");
  const amenities = property.amenities || [];
  const mapQuery = encodeURIComponent(`${property.address}, ${property.city}`);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />Back
      </Button>

      {/* Photo Gallery */}
      {images.length > 0 ? (
        <div className="relative rounded-xl overflow-hidden bg-muted aspect-[16/9]">
          <img
            src={images[currentImage]}
            alt={`${property.title} - Photo ${currentImage + 1}`}
            className="w-full h-full object-cover"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 hover:bg-background transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-foreground font-medium">
                {currentImage + 1} / {images.length}
              </div>
            </>
          )}
          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-12 h-8 rounded overflow-hidden border-2 transition-all ${
                    i === currentImage ? "border-primary scale-110" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={images[i]} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-muted aspect-[16/9] flex items-center justify-center">
          <Home className="w-16 h-16 text-muted-foreground/30" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20 lg:pb-0">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="font-display text-3xl font-bold text-foreground">{property.title}</h1>
              <Badge variant={property.status === "active" ? "default" : "secondary"}>
                {property.status}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-1 text-lg">
              <MapPin className="w-4 h-4" />{property.address}, {property.city}
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">${Number(property.price).toLocaleString()}</span>
            <span className="text-muted-foreground text-lg">/month</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bed className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bath className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Maximize className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{property.area}</p>
                  <p className="text-xs text-muted-foreground">Sq. Ft.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {property.description && (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Map */}
          <Card className="shadow-card">
            <CardContent className="p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Location</h2>
              <div className="rounded-lg overflow-hidden aspect-video bg-muted">
                <iframe
                  title="Property Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Landlord card */}
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Listed by</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {landlord?.full_name?.[0]?.toUpperCase() || "L"}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{landlord?.full_name || "Landlord"}</p>
                  {landlord?.phone_number && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" />{landlord.phone_number}
                    </p>
                  )}
                </div>
              </div>

              <Button className="w-full" variant="outline" onClick={() => { setMessage(""); setContactOpen(true); }}>
                <Mail className="w-4 h-4 mr-2" />Contact Landlord
              </Button>

              {isTenant && (
                <Button className="w-full" onClick={() => { setMessage(""); setApplyOpen(true); }}>
                  <Send className="w-4 h-4 mr-2" />Apply Now
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Property info */}
          <Card className="shadow-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-display text-lg font-semibold text-foreground">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium text-foreground capitalize">{property.property_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium text-foreground capitalize">{property.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed</span>
                  <span className="font-medium text-foreground">{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Contact Landlord</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Send a message about <strong>{property.title}</strong></p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, I'm interested in this property..."
              rows={4}
            />
            <Button onClick={handleContact} className="w-full" disabled={!message.trim()}>
              <Send className="w-4 h-4 mr-2" />Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Apply for {property.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the landlord about yourself..."
              rows={4}
            />
            <Button onClick={handleApply} className="w-full">
              <Send className="w-4 h-4 mr-2" />Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyDetailsPage;
