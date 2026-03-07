import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Plus, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

const WithdrawalsPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const isAdmin = roles.includes("admin");
  const [requests, setRequests] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    payment_method: "mobile_money",
    phone: "",
    bank_name: "",
    account_number: "",
  });

  const fetchRequests = async () => {
    if (!user) return;
    let query = supabase.from("withdrawal_requests").select("*").order("created_at", { ascending: false });
    if (!isAdmin) query = query.eq("user_id", user.id);
    const { data } = await query;
    setRequests(data || []);
  };

  useEffect(() => { fetchRequests(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const details = form.payment_method === "mobile_money"
      ? { phone: form.phone }
      : { bank_name: form.bank_name, account_number: form.account_number };

    const { error } = await supabase.from("withdrawal_requests").insert({
      user_id: user.id,
      amount: parseFloat(form.amount),
      payment_method: form.payment_method,
      payment_details: details,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Request submitted", description: "Your withdrawal request is pending review." });
      setDialogOpen(false);
      setForm({ amount: "", payment_method: "mobile_money", phone: "", bank_name: "", account_number: "" });
      fetchRequests();
    }
    setLoading(false);
  };

  const handleAdminAction = async (id: string, status: "approved" | "rejected") => {
    await supabase.from("withdrawal_requests").update({
      status,
      processed_at: new Date().toISOString(),
    }).eq("id", id);
    toast({ title: `Request ${status}` });
    fetchRequests();
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case "approved": return <CheckCircle className="w-4 h-4 text-success" />;
      case "rejected": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  const statusBadge = (s: string) => {
    const cls = s === "approved" ? "bg-success/10 text-success" : s === "rejected" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning";
    return <Badge className={cls}>{t(`withdrawal.${s}` as any) || s}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{t("withdrawal.title")}</h2>
          <p className="text-muted-foreground text-sm">
            {isAdmin ? "Review and process withdrawal requests" : "Request payouts for your earnings"}
          </p>
        </div>
        {!isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-1" /> {t("withdrawal.requestNew")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">{t("withdrawal.requestNew")}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("withdrawal.amount")}</Label>
                  <Input type="number" min="1000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required placeholder="e.g. 50000" />
                </div>
                <div className="space-y-2">
                  <Label>{t("withdrawal.method")}</Label>
                  <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile_money">{t("withdrawal.mobileMoney")}</SelectItem>
                      <SelectItem value="bank_transfer">{t("withdrawal.bankTransfer")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.payment_method === "mobile_money" ? (
                  <div className="space-y-2">
                    <Label>{t("withdrawal.phone")}</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+250 78x xxx xxx" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>{t("withdrawal.bankName")}</Label>
                      <Input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} required placeholder="e.g. Bank of Kigali" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("withdrawal.accountNumber")}</Label>
                      <Input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} required placeholder="Account number" />
                    </div>
                  </>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("booking.processing") : t("withdrawal.submit")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10"><Clock className="w-5 h-5 text-warning" /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-foreground font-sans">{requests.filter(r => r.status === "pending").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10"><CheckCircle className="w-5 h-5 text-success" /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold text-foreground font-sans">
                {requests.filter(r => r.status === "approved").reduce((s, r) => s + Number(r.amount), 0).toLocaleString()} RWF
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Total Requested</p>
              <p className="text-2xl font-bold text-foreground font-sans">
                {requests.reduce((s, r) => s + Number(r.amount), 0).toLocaleString()} RWF
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">{t("common.noData")}</p>
          ) : (
            <div className="space-y-2">
              {requests.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    {statusIcon(r.status)}
                    <div>
                      <p className="font-semibold text-sm text-foreground font-sans">{Number(r.amount).toLocaleString()} RWF</p>
                      <p className="text-xs text-muted-foreground">
                        {r.payment_method === "mobile_money" ? "Mobile Money" : "Bank Transfer"} · {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusBadge(r.status)}
                    {isAdmin && r.status === "pending" && (
                      <div className="flex gap-1 ml-2">
                        <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10" onClick={() => handleAdminAction(r.id, "approved")}>Approve</Button>
                        <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleAdminAction(r.id, "rejected")}>Reject</Button>
                      </div>
                    )}
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

export default WithdrawalsPage;
