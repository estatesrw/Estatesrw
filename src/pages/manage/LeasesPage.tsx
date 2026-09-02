import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSignature, Plus } from "lucide-react";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useUnits } from "@/hooks/useUnits";
import { useLeases } from "@/hooks/useLeases";
import { useDirectory } from "@/hooks/useDirectory";
import { useAuth } from "@/hooks/useAuth";
import { formatMoney } from "@/lib/unitStatus";

const statusTone: Record<string, string> = {
  active: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  terminated: "bg-destructive/10 text-destructive border-destructive/20",
  expired: "bg-muted text-muted-foreground border-border",
};

const LeasesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const { data: units = [] } = useUnits(propertyId);
  const { data: leases = [], isLoading } = useLeases(propertyId);
  const { data: directory = [] } = useDirectory();

  const currency = property?.currency || "RWF";
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    unit_id: "", tenant_id: "", tenant_name: "", tenant_email: "", tenant_phone: "",
    start_date: new Date().toISOString().slice(0, 10), end_date: "", monthly_rent: "",
    deposit: "", payment_day: "1", notes: "",
  });

  const leasedUnitIds = useMemo(
    () => new Set(leases.filter((l) => l.status === "active" || l.status === "pending").map((l) => l.unit_id)),
    [leases],
  );
  const availableUnits = units.filter((u) => !leasedUnitIds.has(u.id));

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const createLease = useMutation({
    mutationFn: async () => {
      if (!form.unit_id || !form.tenant_id) throw new Error("Pick a unit and a tenant");
      const unit = units.find((u) => u.id === form.unit_id);
      const { error } = await supabase.from("leases").insert({
        property_id: propertyId!,
        unit_id: form.unit_id,
        tenant_id: form.tenant_id,
        tenant_name: form.tenant_name || "Tenant",
        tenant_email: form.tenant_email || null,
        tenant_phone: form.tenant_phone || null,
        start_date: form.start_date,
        end_date: form.end_date || null,
        monthly_rent: Number(form.monthly_rent) || Number(unit?.monthly_rent) || 0,
        deposit: Number(form.deposit) || 0,
        payment_day: Number(form.payment_day) || 1,
        status: "active",
        notes: form.notes || null,
        created_by: user?.id ?? null,
      });
      if (error) throw error;
      await supabase.from("units").update({ status: "occupied" }).eq("id", form.unit_id);
    },
    onSuccess: () => {
      toast.success("Lease created and unit marked occupied");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["pm_leases"] });
      queryClient.invalidateQueries({ queryKey: ["pm_units"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not create the lease"),
  });

  const endLease = useMutation({
    mutationFn: async (lease: { id: string; unit_id: string }) => {
      const { error } = await supabase
        .from("leases")
        .update({ status: "terminated", end_date: new Date().toISOString().slice(0, 10) })
        .eq("id", lease.id);
      if (error) throw error;
      await supabase.from("units").update({ status: "available" }).eq("id", lease.unit_id);
    },
    onSuccess: () => {
      toast.success("Lease ended, unit released");
      queryClient.invalidateQueries({ queryKey: ["pm_leases"] });
      queryClient.invalidateQueries({ queryKey: ["pm_units"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not end the lease"),
  });

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Leases & Tenancies | EstatesRW Management</title>
        <meta name="description" content="Create and manage unit leases, tenants, rent terms and deposits across your managed portfolio." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Leases</h2>
          <p className="text-muted-foreground text-sm">Assign tenants to units and track tenancy terms.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full" disabled={!propertyId}>
                <Plus className="w-4 h-4 mr-1.5" /> New lease
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create a lease</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Unit</Label>
                  <Select value={form.unit_id} onValueChange={(v) => {
                    set("unit_id", v);
                    const u = units.find((x) => x.id === v);
                    if (u) setForm((f) => ({ ...f, unit_id: v, monthly_rent: String(u.monthly_rent), deposit: String(u.deposit ?? u.monthly_rent) }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select an unleased unit" /></SelectTrigger>
                    <SelectContent>
                      {availableUnits.map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.unit_code} · {u.bedrooms} bed · {formatMoney(Number(u.monthly_rent), currency)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tenant</Label>
                  <Select value={form.tenant_id} onValueChange={(v) => {
                    const u = directory.find((d) => d.id === v);
                    setForm((f) => ({ ...f, tenant_id: v, tenant_name: u?.full_name || "", tenant_phone: u?.phone_number || "" }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select a platform user" /></SelectTrigger>
                    <SelectContent>
                      {directory.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.full_name || "Unnamed user"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Tenant name</Label><Input value={form.tenant_name} onChange={(e) => set("tenant_name", e.target.value)} /></div>
                  <div><Label>Tenant email</Label><Input type="email" value={form.tenant_email} onChange={(e) => set("tenant_email", e.target.value)} /></div>
                  <div><Label>Start date</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
                  <div><Label>End date</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
                  <div><Label>Monthly rent ({currency})</Label><Input type="number" value={form.monthly_rent} onChange={(e) => set("monthly_rent", e.target.value)} /></div>
                  <div><Label>Deposit ({currency})</Label><Input type="number" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} /></div>
                  <div><Label>Payment day</Label><Input type="number" min={1} max={28} value={form.payment_day} onChange={(e) => set("payment_day", e.target.value)} /></div>
                </div>
                <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} /></div>
              </div>
              <DialogFooter>
                <Button className="rounded-full" onClick={() => createLease.mutate()} disabled={createLease.isPending}>
                  {createLease.isPending ? "Creating…" : "Create lease"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : !leases.length ? (
          <div className="p-10 text-center">
            <FileSignature className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No leases yet for this property. Create one to place a tenant in a unit.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead><TableHead>Tenant</TableHead><TableHead>Period</TableHead>
                  <TableHead>Rent</TableHead><TableHead>Deposit</TableHead><TableHead>Status</TableHead><TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {leases.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.units?.unit_code || "—"}</TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{l.tenant_name}</div>
                      <div className="text-xs text-muted-foreground">{l.tenant_email || l.tenant_phone || ""}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(l.start_date).toLocaleDateString()} → {l.end_date ? new Date(l.end_date).toLocaleDateString() : "open"}
                    </TableCell>
                    <TableCell>{formatMoney(Number(l.monthly_rent), currency)}</TableCell>
                    <TableCell>{formatMoney(Number(l.deposit), currency)}</TableCell>
                    <TableCell><Badge variant="outline" className={statusTone[l.status] || statusTone.expired}>{l.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {l.status === "active" && (
                        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => endLease.mutate({ id: l.id, unit_id: l.unit_id })}>
                          End
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

export default LeasesPage;
