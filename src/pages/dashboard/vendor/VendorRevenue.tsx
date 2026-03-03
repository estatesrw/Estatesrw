import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const VendorRevenue = () => {
  const { user } = useAuth();
  const [vendor, setVendor] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totals, setTotals] = useState({ revenue: 0, commission: 0, payout: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
      if (!v) return;
      setVendor(v);

      const { data: bks } = await supabase.from("accommodation_bookings").select("*").eq("vendor_id", v.id).neq("status", "cancelled").order("created_at", { ascending: false });
      const all = bks || [];
      setBookings(all);

      const { data: coms } = await supabase.from("vendor_commissions").select("*").eq("vendor_id", v.id).order("created_at", { ascending: false });
      setCommissions(coms || []);

      const revenue = all.reduce((s, b) => s + Number(b.total_price), 0);
      const commission = all.reduce((s, b) => s + Number(b.commission_amount), 0);
      setTotals({ revenue, commission, payout: revenue - commission });
    };
    load();
  }, [user]);

  // Monthly chart data
  const monthlyData = (() => {
    const months: Record<string, { month: string; revenue: number; commission: number }> = {};
    bookings.forEach((b) => {
      const m = b.created_at?.substring(0, 7);
      if (!months[m]) months[m] = { month: m, revenue: 0, commission: 0 };
      months[m].revenue += Number(b.total_price);
      months[m].commission += Number(b.commission_amount);
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
  })();

  const exportCSV = () => {
    const headers = ["Date", "Booking Ref", "Amount", "Commission", "Payout", "Status"];
    const rows = bookings.map(b => [b.created_at?.split("T")[0], b.booking_ref, b.total_price, b.commission_amount, b.vendor_payout, b.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "revenue-report.csv"; a.click();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Revenue & Financials</h2>
          <p className="text-muted-foreground">Commission rate: {vendor.commission_rate}%</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card"><CardContent className="p-6 text-center"><DollarSign className="w-8 h-8 mx-auto text-primary mb-2" /><p className="text-sm text-muted-foreground">Total Revenue</p><p className="font-display text-2xl font-bold text-foreground">${totals.revenue.toLocaleString()}</p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-6 text-center"><TrendingUp className="w-8 h-8 mx-auto text-accent mb-2" /><p className="text-sm text-muted-foreground">Commission Paid</p><p className="font-display text-2xl font-bold text-foreground">${totals.commission.toLocaleString()}</p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-6 text-center"><DollarSign className="w-8 h-8 mx-auto text-primary mb-2" /><p className="text-sm text-muted-foreground">Net Payout</p><p className="font-display text-2xl font-bold text-foreground">${totals.payout.toLocaleString()}</p></CardContent></Card>
      </div>

      {monthlyData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader><CardTitle className="font-display">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="commission" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Commission" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display">Booking-Level Breakdown</CardTitle></CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No revenue data yet.</p>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 20).map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.booking_ref} · {b.guest_name}</p>
                    <p className="text-xs text-muted-foreground">{b.check_in} → {b.check_out}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${Number(b.total_price).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">-${Number(b.commission_amount).toLocaleString()} comm.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorRevenue;
