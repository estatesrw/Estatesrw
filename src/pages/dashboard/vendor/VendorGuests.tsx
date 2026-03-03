import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";

interface GuestSummary {
  guest_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
}

const VendorGuests = () => {
  const { user } = useAuth();
  const [guests, setGuests] = useState<GuestSummary[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: v } = await supabase.from("vendors").select("id").eq("user_id", user.id).maybeSingle();
      if (!v) return;
      const { data: bookings } = await supabase.from("accommodation_bookings").select("*").eq("vendor_id", v.id).order("created_at", { ascending: false });
      if (!bookings) return;

      const map: Record<string, GuestSummary> = {};
      bookings.forEach((b) => {
        if (!map[b.guest_id]) {
          map[b.guest_id] = { guest_id: b.guest_id, guest_name: b.guest_name, guest_email: b.guest_email || "", guest_phone: b.guest_phone || "", totalBookings: 0, totalSpent: 0, lastBooking: b.created_at };
        }
        map[b.guest_id].totalBookings++;
        map[b.guest_id].totalSpent += Number(b.total_price);
      });
      setGuests(Object.values(map).sort((a, b) => b.totalBookings - a.totalBookings));
    };
    load();
  }, [user]);

  const filtered = guests.filter(g => !search || g.guest_name.toLowerCase().includes(search.toLowerCase()) || g.guest_email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Guests</h2>
        <p className="text-muted-foreground">{guests.length} total guests</p>
      </div>
      <Input placeholder="Search guests..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

      {filtered.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-4 text-primary/30" />No guests yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((g) => (
            <Card key={g.guest_id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{g.guest_name}</p>
                    {g.totalBookings > 1 && <Badge className="bg-primary/10 text-primary">Repeat Guest</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{g.guest_email} · {g.guest_phone}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{g.totalBookings} booking(s)</p>
                  <p className="text-sm text-muted-foreground">${g.totalSpent.toLocaleString()} total spent</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorGuests;
