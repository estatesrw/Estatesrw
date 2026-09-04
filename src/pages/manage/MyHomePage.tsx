import { useAuth } from "@/hooks/useAuth";
import { useMyLease, useMyInvoices } from "@/hooks/useLeases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney, STATUS_LABELS, statusStyle, UnitStatus } from "@/lib/unitStatus";
import { Home, MapPin, BedDouble, Bath, Ruler, CalendarDays, Wallet, Receipt, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—";

const invoiceBadge = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-success/10 text-success";
    case "overdue":
      return "bg-destructive/10 text-destructive";
    case "partial":
      return "bg-accent/15 text-accent-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const MyHomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: lease, isLoading } = useMyLease(user?.id);
  const { data: invoices = [] } = useMyInvoices(user?.id);

  const unit = lease?.units as any;
  const property = lease?.pm_properties as any;
  const currency = property?.currency || "RWF";

  const outstanding = invoices
    .filter((i) => i.status !== "paid")
    .reduce((sum, i) => sum + (Number(i.amount) - Number(i.amount_paid || 0)), 0);
  const nextDue = invoices
    .filter((i) => i.status !== "paid")
    .sort((a, b) => a.due_date.localeCompare(b.due_date))[0];

  if (isLoading) {
    return <p className="text-muted-foreground text-sm py-12 text-center">Loading your home…</p>;
  }

  if (!lease) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary text-primary flex items-center justify-center">
          <Home className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-foreground">No active tenancy yet</h1>
        <p className="text-muted-foreground text-sm">
          Once your lease is set up by the management team, your unit details, rent schedule and invoice history will
          appear here.
        </p>
        <Button onClick={() => navigate("/dashboard/browse")}>Browse available homes</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">My Home</h1>
        <p className="text-muted-foreground text-sm">Your tenancy, unit details and rent history.</p>
      </div>

      {/* Lease summary */}
      <Card className="shadow-card overflow-hidden">
        <div className="p-5 flex flex-wrap items-start justify-between gap-4 border-b border-border">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">Unit</p>
            <p className="font-display text-3xl font-semibold text-foreground leading-none">
              {unit?.unit_code || "—"}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5" />
              {property?.name}
              {property?.city ? `, ${property.city}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unit?.status && (
              <span
                className="status-chip text-xs font-semibold px-3 py-1 rounded-full"
                style={statusStyle(unit.status)}
              >
                {STATUS_LABELS[unit.status as UnitStatus] || unit.status}
              </span>
            )}
            <Badge className={lease.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
              Lease {lease.status}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { label: "Monthly rent", value: formatMoney(Number(lease.monthly_rent), currency), icon: Wallet },
            { label: "Deposit held", value: formatMoney(Number(lease.deposit || 0), currency), icon: Receipt },
            { label: "Lease start", value: fmtDate(lease.start_date), icon: CalendarDays },
            { label: "Lease end", value: lease.end_date ? fmtDate(lease.end_date) : "Open ended", icon: CalendarDays },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80 flex items-center gap-1">
                <s.icon className="w-3 h-3" /> {s.label}
              </p>
              <p className="text-sm font-semibold text-foreground tabular-nums">{s.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rent status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">Outstanding</p>
            <p className="font-display text-2xl font-semibold text-foreground tabular-nums">
              {formatMoney(outstanding, currency)}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">Next due date</p>
            <p className="font-display text-2xl font-semibold text-foreground">{fmtDate(nextDue?.due_date)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">Payment day</p>
            <p className="font-display text-2xl font-semibold text-foreground">
              Day {lease.payment_day} of the month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unit details */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Unit details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Bedrooms", value: unit?.bedrooms ?? "—", icon: BedDouble },
              { label: "Bathrooms", value: unit?.bathrooms ?? "—", icon: Bath },
              { label: "Size", value: unit?.size_sqm ? `${unit.size_sqm} m²` : "—", icon: Ruler },
              { label: "View", value: unit?.view_description || "—", icon: Home },
            ].map((d) => (
              <div key={d.label} className="p-3 rounded-xl bg-muted/50 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/80 flex items-center gap-1">
                  <d.icon className="w-3 h-3" /> {d.label}
                </p>
                <p className="text-sm font-medium text-foreground">{d.value}</p>
              </div>
            ))}
          </div>

          {Array.isArray(unit?.features) && unit.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {unit.features.map((f: string) => (
                <Badge key={f} variant="secondary" className="font-normal">{f}</Badge>
              ))}
            </div>
          )}

          <div className="pt-1">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/maintenance")}>
              <Wrench className="w-4 h-4 mr-1.5" /> Report a maintenance issue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base">Invoice history</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No invoices issued yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{fmtDate(inv.period_start)}</TableCell>
                      <TableCell>{fmtDate(inv.due_date)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(Number(inv.amount), currency)}</TableCell>
                      <TableCell className="text-right tabular-nums">{formatMoney(Number(inv.amount_paid || 0), currency)}</TableCell>
                      <TableCell><Badge className={invoiceBadge(inv.status)}>{inv.status}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-xs">{inv.reference || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyHomePage;
