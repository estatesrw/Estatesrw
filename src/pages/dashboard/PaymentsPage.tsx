import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PaymentsPage = () => {
  const { user, roles } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchPayments = async () => {
      const { data } = await supabase.from("payments").select("*, bookings(properties(title, city))").order("created_at", { ascending: false });
      setPayments(data || []);
    };
    fetchPayments();
  }, [user]);

  const statusColor = (s: string) => {
    switch (s) { case "completed": return "bg-primary/10 text-primary"; case "failed": return "bg-destructive/10 text-destructive"; default: return "bg-accent/20 text-accent-foreground"; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Payments</h2>
        <p className="text-muted-foreground">Track all payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No payments found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <Card key={p.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">${Number(p.amount).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {(p.bookings as any)?.properties?.title || p.description || "Payment"} · {new Date(p.created_at).toLocaleDateString()}
                  </p>
                  {p.payment_method && <p className="text-xs text-muted-foreground">via {p.payment_method}</p>}
                </div>
                <Badge className={statusColor(p.status)}>{p.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
