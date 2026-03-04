import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

const GuestPaymentHistoryPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("accommodation_bookings")
        .select("id, booking_ref, total_price, payment_status, payment_method, check_in, check_out, created_at, properties(title), vendors(business_name)")
        .eq("guest_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
    };
    fetch();
  }, [user]);

  const statusColor = (s: string) => {
    switch (s) {
      case "paid": return "bg-primary/10 text-primary";
      case "unpaid": return "bg-accent/10 text-accent";
      case "refunded": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Payment History</h2>
        <p className="text-muted-foreground">Track all your accommodation payments</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            No payment history yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">${Number(b.total_price).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {(b as any).properties?.title} · {(b as any).vendors?.business_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {b.booking_ref} · {b.check_in} → {b.check_out} · {new Date(b.created_at).toLocaleDateString()}
                  </p>
                  {b.payment_method && <p className="text-xs text-muted-foreground">via {b.payment_method}</p>}
                </div>
                <Badge className={statusColor(b.payment_status)}>{b.payment_status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestPaymentHistoryPage;
