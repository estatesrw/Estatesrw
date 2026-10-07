import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useUnits } from "@/hooks/useUnits";
import { useLeases, useRentInvoices } from "@/hooks/useLeases";
import { STATUS_LABELS, OCCUPIED_STATUSES, formatMoney } from "@/lib/unitStatus";
import { Download, Printer, BarChart3 } from "lucide-react";

const toCsv = (rows: (string | number)[][]) =>
  rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");

const download = (name: string, rows: (string | number)[][]) => {
  const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <Card className="rounded-2xl"><CardContent className="p-5">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
  </CardContent></Card>
);

const ReportsPage = () => {
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const currency = property?.currency || "RWF";
  const { data: units = [], isLoading: lu } = useUnits(propertyId);
  const { data: leases = [] } = useLeases(propertyId);
  const { data: invoices = [], isLoading: li } = useRentInvoices(propertyId);
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const occ = useMemo(() => {
    const occupied = units.filter((u) => OCCUPIED_STATUSES.includes(u.status as any)).length;
    const byStatus: Record<string, number> = {};
    units.forEach((u) => (byStatus[u.status] = (byStatus[u.status] || 0) + 1));
    const potential = units.reduce((s, u) => s + Number(u.monthly_rent || 0), 0);
    return { occupied, rate: units.length ? Math.round((occupied / units.length) * 100) : 0, byStatus, potential };
  }, [units]);

  const monthInv = useMemo(() => invoices.filter((i) => i.period_start?.startsWith(month)), [invoices, month]);
  const billed = monthInv.reduce((s, i) => s + Number(i.amount), 0);
  const collected = monthInv.reduce((s, i) => s + Number(i.amount_paid), 0);
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + Number(i.amount) - Number(i.amount_paid), 0);
  const activeLeases = leases.filter((l) => l.status === "active").length;

  const loading = lu || li;
  const slug = (property?.code || "property").toLowerCase();

  return (
    <div className="space-y-6 print:space-y-4">
      <Helmet>
        <title>Reports | EstatesRW Management</title>
        <meta name="description" content="Occupancy, rent collection and owner monthly reports with export." />
      </Helmet>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Reports</h1>
          <p className="text-muted-foreground text-sm">Occupancy and rent collection for {property?.name || "your property"}.</p>
        </div>
        <div className="flex flex-wrap gap-2 print:hidden">
          <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
          <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="w-40" />
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print / PDF</Button>
        </div>
      </div>

      {!propertyId ? (
        <Card className="rounded-3xl"><CardContent className="py-16 text-center space-y-2">
          <BarChart3 className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="font-serif text-xl">No properties yet</p>
          <p className="text-sm text-muted-foreground">Add a property in Property Setup to see reports.</p>
        </CardContent></Card>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Occupancy</h2>
              <Button size="sm" variant="outline" className="print:hidden" onClick={() => download(`${slug}-occupancy.csv`, [
                ["Unit", "Status", "Bedrooms", "Bathrooms", "Monthly rent"],
                ...units.map((u) => [u.unit_code, (STATUS_LABELS as any)[u.status] || u.status, u.bedrooms, u.bathrooms, u.monthly_rent]),
              ])}><Download className="w-4 h-4 mr-2" />CSV</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat label="Total units" value={units.length} />
              <Stat label="Occupied" value={occ.occupied} />
              <Stat label="Occupancy rate" value={`${occ.rate}%`} />
              <Stat label="Active leases" value={activeLeases} />
            </div>
            <Card className="rounded-2xl"><CardHeader><CardTitle className="text-base">Units by status</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {Object.keys(occ.byStatus).length === 0 && <p className="text-sm text-muted-foreground">No units yet.</p>}
                {Object.entries(occ.byStatus).map(([s, n]) => (
                  <div key={s} className="flex items-center gap-3 text-sm">
                    <span className="w-32 text-muted-foreground">{(STATUS_LABELS as any)[s] || s}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(n / units.length) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium">{n}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Rent collection — {month}</h2>
              <Button size="sm" variant="outline" className="print:hidden" onClick={() => download(`${slug}-rent-${month}.csv`, [
                ["Unit", "Tenant", "Due date", "Amount", "Paid", "Status"],
                ...monthInv.map((i) => [i.units?.unit_code || "", i.leases?.tenant_name || "", i.due_date, i.amount, i.amount_paid, i.status]),
              ])}><Download className="w-4 h-4 mr-2" />CSV</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat label="Billed" value={formatMoney(billed, currency)} />
              <Stat label="Collected" value={formatMoney(collected, currency)} />
              <Stat label="Collection rate" value={billed ? `${Math.round((collected / billed) * 100)}%` : "—"} />
              <Stat label="Total outstanding" value={formatMoney(outstanding, currency)} />
            </div>
            <Card className="rounded-2xl"><CardContent className="p-0">
              {monthInv.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground text-center">No invoices for this month. Generate them in Rent Collection.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left text-muted-foreground border-b border-border">
                    <tr><th className="p-3">Unit</th><th className="p-3">Tenant</th><th className="p-3">Due</th><th className="p-3 text-right">Amount</th><th className="p-3 text-right">Paid</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody>
                    {monthInv.map((i) => (
                      <tr key={i.id} className="border-b border-border/60 last:border-0">
                        <td className="p-3 font-medium">{i.units?.unit_code}</td>
                        <td className="p-3">{i.leases?.tenant_name}</td>
                        <td className="p-3">{i.due_date}</td>
                        <td className="p-3 text-right">{formatMoney(Number(i.amount), currency)}</td>
                        <td className="p-3 text-right">{formatMoney(Number(i.amount_paid), currency)}</td>
                        <td className="p-3 capitalize">{i.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent></Card>
            <p className="text-xs text-muted-foreground">Potential monthly rent if fully let: {formatMoney(occ.potential, currency)}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default ReportsPage;
