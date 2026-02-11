import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const BookingsPage = () => {
  const { user, roles } = useAuth();
  const isLandlord = roles.includes("landlord");
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      let query = supabase.from("bookings").select("*, properties(title, city, address)").order("created_at", { ascending: false });
      if (!roles.includes("admin")) {
        if (isLandlord) {
          // RLS handles filtering
        } else {
          query = query.eq("tenant_id", user.id);
        }
      }
      const { data } = await query;
      setBookings(data || []);
    };
    fetchBookings();
  }, [user]);

  const statusColor = (s: string) => {
    switch (s) {
      case "active": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-accent/20 text-accent-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Bookings</h2>
        <p className="text-muted-foreground">{isLandlord ? "Manage property bookings" : "Your rental bookings"}</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No bookings found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-foreground">{(b.properties as any)?.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(b.properties as any)?.city} · {new Date(b.start_date).toLocaleDateString()} {b.end_date ? `- ${new Date(b.end_date).toLocaleDateString()}` : "- Ongoing"}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-1">${Number(b.monthly_rent).toLocaleString()}/mo</p>
                </div>
                <Badge className={statusColor(b.status)}>{b.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
