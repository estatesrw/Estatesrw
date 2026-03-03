import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Download, Settings } from "lucide-react";

const CommissionManagement = () => {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [globalRate, setGlobalRate] = useState(10);
  const [totals, setTotals] = useState({ total: 0, pending: 0, paid: 0 });

  useEffect(() => {
    const load = async () => {
      const [comRes, venRes] = await Promise.all([
        supabase.from("vendor_commissions").select("*, vendors(business_name)").order("created_at", { ascending: false }),
        supabase.from("vendors").select("id, business_name, commission_rate").eq("status", "approved"),
      ]);
      const coms = comRes.data || [];
      setCommissions(coms);
      setVendors(venRes.data || []);
      setTotals({
        total: coms.reduce((s, c) => s + Number(c.commission_amount), 0),
        pending: coms.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0),
        paid: coms.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.commission_amount), 0),
      });
    };
    load();
  }, []);

  const setGlobalCommission = async () => {
    const { error } = await supabase.from("vendors").update({ commission_rate: globalRate }).eq("status", "approved");
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Global commission set to ${globalRate}%` });
  };

  const exportCSV = () => {
    const headers = ["Date", "Vendor", "Booking Amount", "Rate", "Commission", "Payout", "Status"];
    const rows = commissions.map(c => [c.created_at?.split("T")[0], (c as any).vendors?.business_name, c.booking_amount, `${c.commission_rate}%`, c.commission_amount, c.vendor_payout, c.status]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "commissions.csv"; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Commission Management</h2>
          <p className="text-muted-foreground">Track and manage platform commissions</p>
        </div>
        <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-2" /> Export</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card"><CardContent className="p-6 text-center"><DollarSign className="w-8 h-8 mx-auto text-primary mb-2" /><p className="text-sm text-muted-foreground">Total Commission</p><p className="font-display text-2xl font-bold text-foreground">${totals.total.toLocaleString()}</p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-6 text-center"><DollarSign className="w-8 h-8 mx-auto text-accent mb-2" /><p className="text-sm text-muted-foreground">Pending</p><p className="font-display text-2xl font-bold text-foreground">${totals.pending.toLocaleString()}</p></CardContent></Card>
        <Card className="shadow-card"><CardContent className="p-6 text-center"><DollarSign className="w-8 h-8 mx-auto text-primary mb-2" /><p className="text-sm text-muted-foreground">Paid</p><p className="font-display text-2xl font-bold text-foreground">${totals.paid.toLocaleString()}</p></CardContent></Card>
      </div>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display">Global Commission Rate</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="space-y-2 flex-1 max-w-xs">
              <Label>Rate (%)</Label>
              <Input type="number" value={globalRate} onChange={(e) => setGlobalRate(Number(e.target.value))} min={0} max={100} />
            </div>
            <Button onClick={setGlobalCommission}><Settings className="w-4 h-4 mr-2" /> Apply to All Vendors</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="font-display">Commission Log</CardTitle></CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No commission records yet.</p>
          ) : (
            <div className="space-y-2">
              {commissions.slice(0, 30).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{(c as any).vendors?.business_name}</p>
                    <p className="text-xs text-muted-foreground">Booking: ${Number(c.booking_amount).toLocaleString()} · Rate: {c.commission_rate}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${Number(c.commission_amount).toLocaleString()}</p>
                    <Badge className={c.status === "paid" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}>{c.status}</Badge>
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

export default CommissionManagement;
