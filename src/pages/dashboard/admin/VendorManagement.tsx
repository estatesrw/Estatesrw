import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Ban, Settings, Building2 } from "lucide-react";

const VendorManagement = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [editVendor, setEditVendor] = useState<any>(null);
  const [commissionRate, setCommissionRate] = useState(10);

  const fetchVendors = async () => {
    let q = supabase.from("vendors").select("*, profiles(full_name)").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setVendors(data || []);
  };

  useEffect(() => { fetchVendors(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("vendors").update({ status }).eq("id", id);
    toast({ title: `Vendor ${status}` });
    fetchVendors();
  };

  const updateCommission = async () => {
    if (!editVendor) return;
    await supabase.from("vendors").update({ commission_rate: commissionRate }).eq("id", editVendor.id);
    toast({ title: "Commission updated" });
    setEditVendor(null);
    fetchVendors();
  };

  const statusColor = (s: string) => {
    switch (s) { case "approved": return "bg-primary/10 text-primary"; case "pending": return "bg-accent/10 text-accent"; case "suspended": return "bg-destructive/10 text-destructive"; default: return "bg-muted text-muted-foreground"; }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Vendor Management</h2>
        <p className="text-muted-foreground">Approve, manage, and monitor vendors</p>
      </div>

      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Vendors</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>

      {vendors.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground"><Building2 className="w-12 h-12 mx-auto mb-4 text-primary/30" />No vendors found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {vendors.map((v) => (
            <Card key={v.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{v.business_name}</p>
                      <Badge className={statusColor(v.status)}>{v.status}</Badge>
                      <Badge className="bg-secondary text-secondary-foreground">{v.business_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{v.city} · {v.phone} · Commission: {v.commission_rate}%</p>
                    <p className="text-xs text-muted-foreground">Registered: {new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {v.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => updateStatus(v.id, "approved")}><Check className="w-4 h-4 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline" onClick={() => updateStatus(v.id, "rejected")} className="text-destructive"><X className="w-4 h-4 mr-1" /> Reject</Button>
                      </>
                    )}
                    {v.status === "approved" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus(v.id, "suspended")} className="text-destructive"><Ban className="w-4 h-4 mr-1" /> Suspend</Button>
                    )}
                    {v.status === "suspended" && (
                      <Button size="sm" onClick={() => updateStatus(v.id, "approved")}><Check className="w-4 h-4 mr-1" /> Reactivate</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => { setEditVendor(v); setCommissionRate(v.commission_rate); }}>
                      <Settings className="w-4 h-4 mr-1" /> Commission
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editVendor} onOpenChange={(o) => !o && setEditVendor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Set Commission Rate</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Vendor: {editVendor?.business_name}</p>
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input type="number" value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} min={0} max={100} />
            </div>
            <Button onClick={updateCommission} className="w-full">Save Commission Rate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorManagement;
