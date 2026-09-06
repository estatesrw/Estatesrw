import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useLeases } from "@/hooks/useLeases";
import { useContracts, useContractSignatures, Contract } from "@/hooks/useContracts";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { FileSignature, Printer, Sparkles, Download, CheckCircle2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  awaiting_signatures: "bg-amber-500/15 text-amber-600",
  signed: "bg-primary/15 text-primary",
  void: "bg-destructive/15 text-destructive",
};

const statusLabel = (s: string) => s.replace(/_/g, " ");

const ContractsPage = () => {
  const { user, profile, roles } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const isManager = properties.length > 0;

  const { data: leases = [] } = useLeases(isManager ? propertyId : null);
  const { data: contracts = [], isLoading } = useContracts(isManager ? propertyId : null);

  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<string>("");
  const [selected, setSelected] = useState<Contract | null>(null);
  const [signature, setSignature] = useState("");
  const { data: signatures = [] } = useContractSignatures(selected?.id ?? null);

  const [form, setForm] = useState({
    lease_id: "",
    tenant_name: "",
    landlord_name: "",
    unit_code: "",
    monthly_rent: "",
    deposit: "",
    management_fee_percent: "10",
    payment_received: "",
    payment_reference: "",
    payment_date: new Date().toISOString().slice(0, 10),
    start_date: "",
    end_date: "",
    special_terms: "",
  });

  const activeLeases = useMemo(() => leases.filter((l) => l.status === "active"), [leases]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const pickLease = (id: string) => {
    const l = activeLeases.find((x) => x.id === id);
    if (!l) return;
    setForm((f) => ({
      ...f,
      lease_id: id,
      tenant_name: l.tenant_name,
      unit_code: l.units?.unit_code || "",
      monthly_rent: String(l.monthly_rent),
      deposit: String(l.deposit),
      start_date: l.start_date,
      end_date: l.end_date || "",
      payment_received: f.payment_received || String(l.monthly_rent),
    }));
  };

  const generate = async () => {
    if (!propertyId) return;
    if (!form.tenant_name.trim()) {
      toast({ title: "Tenant name is required", variant: "destructive" });
      return;
    }
    setGenerating(true);
    const { data, error } = await supabase.functions.invoke("generate-contract", {
      body: {
        property_id: propertyId,
        contract_type: "property_management",
        property_name: property?.name,
        property_address: `${property?.address ?? ""}, ${property?.city ?? ""}`,
        unit_code: form.unit_code,
        tenant_name: form.tenant_name,
        landlord_name: form.landlord_name,
        manager_name: profile?.full_name || "EstatesRW Management",
        currency: property?.currency || "RWF",
        monthly_rent: Number(form.monthly_rent) || 0,
        deposit: Number(form.deposit) || 0,
        management_fee_percent: Number(form.management_fee_percent) || 0,
        payment_received: Number(form.payment_received) || 0,
        payment_reference: form.payment_reference,
        payment_date: form.payment_date,
        start_date: form.start_date,
        end_date: form.end_date,
        special_terms: form.special_terms,
      },
    });
    setGenerating(false);
    const message = (data as any)?.error || (error as any)?.message;
    if (error || !(data as any)?.content) {
      toast({ title: "Could not generate the contract", description: message, variant: "destructive" });
      return;
    }
    setDraft((data as any).content);
  };

  const saveContract = async () => {
    if (!propertyId || !draft.trim() || !user) return;
    setSaving(true);
    const lease = activeLeases.find((l) => l.id === form.lease_id);
    const { error } = await supabase.from("contracts").insert({
      property_id: propertyId,
      unit_id: lease?.unit_id ?? null,
      lease_id: form.lease_id || null,
      tenant_id: lease?.tenant_id ?? null,
      created_by: user.id,
      title: `${property?.name ?? "Property"} — ${form.unit_code || "Management"} contract`,
      contract_type: "property_management",
      tenant_name: form.tenant_name,
      landlord_name: form.landlord_name || null,
      manager_name: profile?.full_name || "EstatesRW Management",
      currency: property?.currency || "RWF",
      monthly_rent: Number(form.monthly_rent) || 0,
      deposit: Number(form.deposit) || 0,
      management_fee_percent: Number(form.management_fee_percent) || 0,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      content: draft,
      input_details: form,
      status: "awaiting_signatures",
    });
    setSaving(false);
    if (error) {
      toast({ title: "Could not save the contract", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Contract saved", description: "Everyone involved can now read and sign it." });
    setDraft("");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["contracts"] });
  };

  const sign = async () => {
    if (!selected || !user || !signature.trim()) return;
    const role = roles.includes("admin") ? "manager" : roles.includes("landlord") ? "landlord" : "tenant";
    const { error } = await supabase.from("contract_signatures").insert({
      contract_id: selected.id,
      user_id: user.id,
      signer_role: role,
      signer_name: profile?.full_name || signature.trim(),
      typed_signature: signature.trim(),
    });
    if (error) {
      toast({ title: "Could not record your signature", description: error.message, variant: "destructive" });
      return;
    }
    setSignature("");
    toast({ title: "Signed", description: "Your signature has been stored." });
    qc.invalidateQueries({ queryKey: ["contract_signatures", selected.id] });
    qc.invalidateQueries({ queryKey: ["contracts"] });
  };

  const printContract = (c: Contract) => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<title>${c.title}</title><pre style="font-family:Georgia,serif;white-space:pre-wrap;padding:40px;line-height:1.6">${c.content.replace(/</g, "&lt;")}</pre>`
    );
    w.document.close();
    w.print();
  };

  const download = (c: Contract) => {
    const blob = new Blob([c.content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${c.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const alreadySigned = signatures.some((s) => s.user_id === user?.id);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Contracts | EstatesRW Management</title>
        <meta name="description" content="Generate, sign and store property management contracts for tenants, owners and managers." />
      </Helmet>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Contracts</h1>
          <p className="text-muted-foreground text-sm">Generated agreements, signatures and archives.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          {isManager && <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />}
          {isManager && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full"><Sparkles className="w-4 h-4 mr-2" />Generate contract</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Generate a contract</DialogTitle></DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Tenancy</Label>
                    <Select value={form.lease_id} onValueChange={pickLease}>
                      <SelectTrigger><SelectValue placeholder="Pick an active tenancy (optional)" /></SelectTrigger>
                      <SelectContent>
                        {activeLeases.map((l) => (
                          <SelectItem key={l.id} value={l.id}>{l.units?.unit_code} · {l.tenant_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Tenant name</Label><Input value={form.tenant_name} onChange={(e) => set("tenant_name", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Owner / landlord name</Label><Input value={form.landlord_name} onChange={(e) => set("landlord_name", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Unit</Label><Input value={form.unit_code} onChange={(e) => set("unit_code", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Monthly rent</Label><Input type="number" value={form.monthly_rent} onChange={(e) => set("monthly_rent", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Security deposit</Label><Input type="number" value={form.deposit} onChange={(e) => set("deposit", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Management fee %</Label><Input type="number" value={form.management_fee_percent} onChange={(e) => set("management_fee_percent", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Payment received</Label><Input type="number" value={form.payment_received} onChange={(e) => set("payment_received", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Payment reference</Label><Input value={form.payment_reference} onChange={(e) => set("payment_reference", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Payment date</Label><Input type="date" value={form.payment_date} onChange={(e) => set("payment_date", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Start date</Label><Input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} /></div>
                  <div className="space-y-2"><Label>End date</Label><Input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} /></div>
                  <div className="sm:col-span-2 space-y-2"><Label>Special terms</Label><Textarea rows={3} value={form.special_terms} onChange={(e) => set("special_terms", e.target.value)} /></div>
                </div>

                {draft && (
                  <div className="space-y-2">
                    <Label>Draft document — edit before saving</Label>
                    <Textarea rows={14} value={draft} onChange={(e) => setDraft(e.target.value)} className="font-mono text-xs" />
                  </div>
                )}

                <DialogFooter className="gap-2">
                  <Button variant="outline" className="rounded-full" onClick={generate} disabled={generating}>
                    <Sparkles className="w-4 h-4 mr-2" />{generating ? "Drafting..." : draft ? "Re-draft" : "Draft with AI"}
                  </Button>
                  <Button className="rounded-full" onClick={saveContract} disabled={!draft.trim() || saving}>
                    {saving ? "Saving..." : "Save & send for signing"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : contracts.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-16 text-center space-y-2">
            <FileSignature className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="font-serif text-xl">No contracts yet</p>
            <p className="text-sm text-muted-foreground">
              {isManager ? "Generate a contract once a tenant has paid." : "Contracts shared with you will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contracts.map((c) => (
            <Card key={c.id} className="rounded-3xl hover:shadow-card transition-shadow cursor-pointer" onClick={() => setSelected(c)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{c.title}</CardTitle>
                  <Badge className={statusStyles[c.status] || ""}>{statusLabel(c.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{c.tenant_name}</p>
                <p>{c.currency} {Number(c.monthly_rent).toLocaleString()} / month</p>
                <p className="text-xs">{new Date(c.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selected && (
            <>
              <SheetHeader><SheetTitle className="font-serif text-2xl pr-8">{selected.title}</SheetTitle></SheetHeader>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge className={statusStyles[selected.status] || ""}>{statusLabel(selected.status)}</Badge>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => printContract(selected)}><Printer className="w-4 h-4 mr-2" />Print</Button>
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => download(selected)}><Download className="w-4 h-4 mr-2" />Download</Button>
              </div>

              <pre className="mt-6 whitespace-pre-wrap font-serif text-sm leading-relaxed bg-secondary/40 rounded-2xl p-5">{selected.content}</pre>

              <div className="mt-6 space-y-3">
                <p className="font-medium text-sm">Signatures</p>
                {signatures.length === 0 && <p className="text-sm text-muted-foreground">No signatures yet.</p>}
                {signatures.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span className="font-serif italic">{s.typed_signature}</span>
                    <span className="text-muted-foreground">{s.signer_role} · {new Date(s.signed_at).toLocaleDateString()}</span>
                  </div>
                ))}

                {!alreadySigned && selected.status !== "void" && (
                  <div className="space-y-2 pt-2">
                    <Label>Type your full name to sign</Label>
                    <div className="flex gap-2">
                      <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Your full name" />
                      <Button className="rounded-full" onClick={sign} disabled={!signature.trim()}>Sign</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Typing your name counts as your signature and is stored with the date.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ContractsPage;
