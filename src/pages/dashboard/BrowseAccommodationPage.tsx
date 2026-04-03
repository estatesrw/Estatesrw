import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Search, MapPin, BedDouble, Users, CalendarCheck, Star,
  ChevronRight, Wifi, Car, Waves, Dumbbell, Shield, Zap,
  CheckCircle2, ArrowRight,
} from "lucide-react";

interface VendorProperty {
  id: string;
  title: string;
  city: string;
  address: string;
  description: string | null;
  images: string[] | null;
  property_type: string;
  landlord_id: string;
}

interface RoomType {
  id: string;
  property_id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  max_guests: number;
  price_per_night: number;
  weekend_price: number | null;
  minimum_stay: number;
  amenities: string[] | null;
  images: string[] | null;
  status: string;
  total_rooms: number;
}

interface Vendor {
  id: string;
  business_name: string;
  city: string;
  business_type: string;
  commission_rate: number;
}

const CITIES = ["Kigali", "Musanze", "Rubavu", "Huye", "Rusizi", "Muhanga"];

const BrowseAccommodationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [properties, setProperties] = useState<VendorProperty[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Booking form state
  const [bookingRoom, setBookingRoom] = useState<RoomType | null>(null);
  const [bookingProperty, setBookingProperty] = useState<VendorProperty | null>(null);
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Property detail view
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [vRes, pRes, rRes] = await Promise.all([
        supabase.from("vendors").select("*").eq("status", "approved"),
        supabase.from("properties").select("*").eq("status", "active"),
        supabase.from("room_types").select("*").eq("status", "active"),
      ]);
      setVendors(vRes.data || []);
      setProperties(pRes.data || []);
      setRoomTypes(rRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  // Pre-fill guest info
  useEffect(() => {
    if (user) {
      setGuestEmail(user.email || "");
      supabase.from("profiles").select("full_name, phone_number").eq("id", user.id).maybeSingle()
        .then(({ data }) => {
          if (data?.full_name) setGuestName(data.full_name);
          if (data?.phone_number) setGuestPhone(data.phone_number);
        });
    }
  }, [user]);

  // Get vendor properties that have room types
  const vendorPropertyIds = new Set(roomTypes.map(r => r.property_id));
  const accommodationProperties = properties.filter(p => vendorPropertyIds.has(p.id));

  const filtered = accommodationProperties.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === "all" || p.city === cityFilter;
    return matchSearch && matchCity;
  });

  const getVendorForProperty = (propertyId: string) => {
    const room = roomTypes.find(r => r.property_id === propertyId);
    return room ? vendors.find(v => v.id === room.vendor_id) : null;
  };

  const getRoomsForProperty = (propertyId: string) => roomTypes.filter(r => r.property_id === propertyId);

  const getLowestPrice = (propertyId: string) => {
    const rooms = getRoomsForProperty(propertyId);
    if (rooms.length === 0) return 0;
    return Math.min(...rooms.map(r => r.price_per_night));
  };

  const calculateTotal = () => {
    if (!bookingRoom || !checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    return nights * bookingRoom.price_per_night;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const openBookingDialog = (room: RoomType, property: VendorProperty) => {
    const vendor = getVendorForProperty(property.id);
    setBookingRoom(room);
    setBookingProperty(property);
    setBookingVendor(vendor || null);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setNotes("");
  };

  const submitBooking = async () => {
    if (!user || !bookingRoom || !bookingProperty || !bookingVendor || !checkIn || !checkOut || !guestName) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const nights = calculateNights();
    if (nights < bookingRoom.minimum_stay) {
      toast({ title: `Minimum stay is ${bookingRoom.minimum_stay} night(s)`, variant: "destructive" });
      return;
    }

    const totalPrice = calculateTotal();
    const commissionAmount = totalPrice * (bookingVendor.commission_rate / 100);
    const vendorPayout = totalPrice - commissionAmount;

    setSubmitting(true);
    const { error } = await supabase.from("accommodation_bookings").insert({
      guest_id: user.id,
      property_id: bookingProperty.id,
      room_type_id: bookingRoom.id,
      vendor_id: bookingVendor.id,
      check_in: checkIn,
      check_out: checkOut,
      nights,
      guests,
      total_price: totalPrice,
      commission_amount: commissionAmount,
      vendor_payout: vendorPayout,
      guest_name: guestName,
      guest_email: guestEmail,
      guest_phone: guestPhone,
      notes: notes || null,
      status: "pending",
      payment_status: "unpaid",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking request submitted!", description: "You will be notified once the admin reviews your request." });
      setBookingRoom(null);
      setBookingProperty(null);
      setBookingVendor(null);
      setSelectedProperty(null);
    }
    setSubmitting(false);
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading accommodations...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Browse Accommodation</h2>
        <p className="text-muted-foreground">Find and book hotels, apartments, and guesthouses across Rwanda</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} accommodation{filtered.length !== 1 ? "s" : ""} available</p>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <BedDouble className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            No accommodations found. Check back soon!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((property) => {
            const vendor = getVendorForProperty(property.id);
            const rooms = getRoomsForProperty(property.id);
            const lowestPrice = getLowestPrice(property.id);
            const isExpanded = selectedProperty === property.id;

            return (
              <Card key={property.id} className="shadow-card overflow-hidden">
                <CardContent className="p-0">
                  {/* Property header */}
                  <div
                    className="flex flex-col sm:flex-row gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedProperty(isExpanded ? null : property.id)}
                  >
                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-muted shrink-0">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BedDouble className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground">{property.title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{property.address}, {property.city}
                          </p>
                          {vendor && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Managed by <span className="font-medium text-foreground">{vendor.business_name}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="text-xl font-bold text-foreground">{lowestPrice.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">RWF / night</p>
                        </div>
                      </div>
                      {property.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{property.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">{property.property_type}</Badge>
                        <Badge variant="outline" className="text-xs">{rooms.length} room type{rooms.length !== 1 ? "s" : ""}</Badge>
                        <span className="text-xs text-primary font-medium flex items-center gap-1 ml-auto">
                          {isExpanded ? "Hide rooms" : "View rooms"} <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded room types */}
                  {isExpanded && (
                    <div className="border-t border-border px-4 pb-4 pt-3 space-y-3 bg-muted/20">
                      <h4 className="text-sm font-semibold text-foreground">Available Room Types</h4>
                      {rooms.map((room) => (
                        <div key={room.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card border border-border">
                          <div className="w-full sm:w-36 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                            {room.images && room.images.length > 0 ? (
                              <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BedDouble className="w-6 h-6 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h5 className="font-medium text-foreground">{room.name}</h5>
                                {room.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{room.description}</p>}
                                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to {room.max_guests}</span>
                                  <span>{room.total_rooms} room{room.total_rooms !== 1 ? "s" : ""}</span>
                                  <span>Min {room.minimum_stay} night{room.minimum_stay !== 1 ? "s" : ""}</span>
                                </div>
                                {(room.amenities || []).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {(room.amenities as string[]).slice(0, 5).map(a => (
                                      <Badge key={a} variant="outline" className="text-[10px] px-1.5 py-0">{a}</Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-foreground">{room.price_per_night.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground">RWF / night</p>
                                {room.weekend_price && (
                                  <p className="text-[10px] text-muted-foreground">Weekend: {room.weekend_price.toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3"
                              onClick={(e) => { e.stopPropagation(); openBookingDialog(room, property); }}
                            >
                              <CalendarCheck className="w-3.5 h-3.5 mr-1.5" /> Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Request Dialog */}
      <Dialog open={!!bookingRoom} onOpenChange={(o) => { if (!o) { setBookingRoom(null); setBookingProperty(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Request Booking</DialogTitle>
          </DialogHeader>
          {bookingRoom && bookingProperty && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-1">
                <p className="font-medium text-foreground">{bookingProperty.title}</p>
                <p className="text-sm text-muted-foreground">{bookingRoom.name} · Up to {bookingRoom.max_guests} guests</p>
                <p className="text-sm font-semibold text-foreground">{bookingRoom.price_per_night.toLocaleString()} RWF / night</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Check-in *</Label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={today} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Check-out *</Label>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || today} />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <Label className="text-xs">Number of Guests</Label>
                <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: bookingRoom.max_guests }, (_, i) => i + 1).map(n => (
                      <SelectItem key={n} value={String(n)}>{n} Guest{n > 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Guest info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name *</Label>
                  <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+250 7XX XXX XXX" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Special Requests</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requirements..." rows={2} />
              </div>

              {/* Price breakdown */}
              {checkIn && checkOut && calculateNights() > 0 && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{bookingRoom.price_per_night.toLocaleString()} RWF × {calculateNights()} night{calculateNights() > 1 ? "s" : ""}</span>
                    <span className="font-medium text-foreground">{calculateTotal().toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold border-t border-primary/10 pt-1.5">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">{calculateTotal().toLocaleString()} RWF</span>
                  </div>
                </div>
              )}

              {/* Booking flow info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>After submitting, the admin will review your request. Once approved, you'll be asked to complete payment via Mobile Money.</span>
              </div>

              <Button onClick={submitBooking} className="w-full" disabled={submitting || !checkIn || !checkOut || !guestName}>
                {submitting ? "Submitting..." : "Submit Booking Request"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrowseAccommodationPage;
