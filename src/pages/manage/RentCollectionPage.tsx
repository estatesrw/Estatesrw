import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Zap } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useLeases, useRentInvoices } from "@/hooks/useLeases";
import { formatMoney } from "@/lib/unitStatus";

const tone: Record<string, string> = {
  paid: "bg-primary/10 text-primary border-primary/20",
  partial: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  due: "bg-secondary text-foreground border-border",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
};

const RentCollectionPage = () => {
  const queryClient = useQueryClient();
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const { data: leases = [] } = useLeases(propertyId);
  const { data: invoices = [], isLoading } = useRentInvoices(propertyId);
  const currency = property?.currency || "RWF";
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const totals = useMemo(() => {
    const billed = invoices.reduce((s, i) => s + Number(i.amount), 0);
    const collected = invoices.reduce((s, i) => s + Number(i.amount_paid), 0);
    const outstanding = billed - collected;
    return { billed, collected, outstanding, rate: billed ? Math.round((collected / billed) * 100) : 0 };
  }, [invoices]);

  const generate = useMutation({
    mutationFn: async () => {
      const active = leases.filter((l) => l.status === "active");
      if (!active.length) throw new Error("No active leases to invoice");
      const periodStart = `${month}-01`;
      const existing = new Set(invoices.filter((i) => i.period_start === periodStart).map((i) => i.lease_id));
      const rows = active.filter((l) => !existing.has(l.id)).map((l) => {
        const day = Math.min(Math.max(l.payment_day || 1, 1), 28);
        return {
          lease_id: l.id,
          property_id: propertyId!,
          unit_id: l.unit_id,
          tenant_id: l.tenant_id,
          period_start: periodStart,
          due_date: `${month}-${String(day).padStart(2, "0")}`,
          amount: Number(l.monthly_rent),
          amount_paid: 0,
          status: "due",
          reference: `RENT-${month.replace("-", "")}-${l.units?.unit_code || l.unit_id.slice(0, 6)}`,
        };
      });
      if (!rows.length) throw new Error("All active leases already invoiced for this month");
      const { error } = await supabase.from("rent_invoices").insert(rows);
      if (error) throw error;
      return rows.length;
    },
    onSuccess: (n) => {
      toast.success(`${n} invoice${n === 1 ? "" : "s"} generated`);
      queryClient.invalidateQueries({ queryKey: ["pm_invoices"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not generate invoices"),
  });

  const markPaid = useMutation({
    mutationFn: async (inv: { id: string; amount: number }) => {
      const { error } = await supabase
        .from("rent_invoices")
        .update({ amount_paid: inv.amount, status: "paid", paid_at: new Date().toISOString() })
        .eq("id", inv.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Payment recorded");
      queryClient.invalidateQueries({ queryKey: ["pm_invoices"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not record the payment"),
  });

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Rent Collection | EstatesRW Management</title>
        <meta name="description" content="Generate monthly rent invoices, track collection rate and record tenant payments per unit." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Rent Collection</h2>
          <p className="text-muted-foreground text-sm">Invoice active leases and record payments as they land.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-full sm:w-[170px]" />
          <Button className="rounded-full" onClick={() => generate.mutate()} disabled={!propertyId || generate.isPending}>
            <Zap className="w-4 h-4 mr-1.5" /> Generate invoices
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Billed" value={formatMoney(totals.billed, currency)} icon={<Receipt className="w-5 h-5" />} />
        <StatsCard title="Collected" value={formatMoney(totals.collected, currency)} icon={<Receipt className="w-5 h-5" />} />
        <StatsCard title="Outstanding" value={formatMoney(totals.outstanding, currency)} icon={<Receipt className="w-5 h-5" />} />
        <StatsCard title="Collection rate" value={`${totals.rate}%`} icon={<Receipt className="w-5 h-5" />} />
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : !invoices.length ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No invoices yet. Pick a month and generate invoices for the active leases.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead><TableHead>Unit</TableHead><TableHead>Tenant</TableHead>
                  <TableHead>Due</TableHead><TableHead>Amount</TableHead><TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead><TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="text-xs text-muted-foreground">{i.reference || i.id.slice(0, 8)}</TableCell>
                    <TableCell className="font-medium">{i.units?.unit_code || "—"}</TableCell>
                    <TableCell className="text-sm">{i.leases?.tenant_name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(i.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatMoney(Number(i.amount), currency)}</TableCell>
                    <TableCell>{formatMoney(Number(i.amount_paid), currency)}</TableCell>
                    <TableCell><Badge variant="outline" className={tone[i.status] || tone.due}>{i.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {i.status !== "paid" && (
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => markPaid.mutate({ id: i.id, amount: Number(i.amount) })}>
                          Mark paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentCollectionPage;
