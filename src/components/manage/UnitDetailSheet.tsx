import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ManagedUnit } from "@/hooks/useUnits";
import { STATUS_LABELS, UNIT_STATUSES, UnitStatus, statusStyle, formatMoney } from "@/lib/unitStatus";

interface Props {
  unit: ManagedUnit | null;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2 border-b border-border/60 last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground text-right">{value}</span>
  </div>
);

const UnitDetailSheet = ({ unit, currency, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const history = useQuery({
    queryKey: ["unit_status_history", unit?.id],
    enabled: !!unit?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unit_status_history")
        .select("id, from_status, to_status, created_at, note")
        .eq("unit_id", unit!.id)
        .order("created_at", { ascending: false })
        .limit(15);
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async (status: UnitStatus) => {
      const { error } = await supabase.from("units").update({ status }).eq("id", unit!.id);
      if (error) throw error;
    },
    onSuccess: (_d, status) => {
      toast.success(`${unit?.unit_code} set to ${STATUS_LABELS[status]}`);
      queryClient.invalidateQueries({ queryKey: ["pm_units"] });
      queryClient.invalidateQueries({ queryKey: ["unit_status_history", unit?.id] });
      queryClient.invalidateQueries({ queryKey: ["pm_activity"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not update this unit"),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {unit && (
          <>
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl">{unit.unit_code}</SheetTitle>
              <SheetDescription>
                {unit.bedrooms} bed · {unit.bathrooms} bath · {unit.furnished}
              </SheetDescription>
              <div style={statusStyle(unit.status)}>
                <span className="status-chip">{STATUS_LABELS[unit.status as UnitStatus] ?? unit.status}</span>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70 mb-2">Change status</p>
                <Select value={unit.status} onValueChange={(v) => updateStatus.mutate(v as UnitStatus)} disabled={updateStatus.isPending}>
                  <SelectTrigger className="rounded-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNIT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70 mb-2">Unit details</p>
                <Row label="Monthly rent" value={formatMoney(Number(unit.monthly_rent), currency)} />
                <Row label="Deposit" value={unit.deposit ? formatMoney(Number(unit.deposit), currency) : "—"} />
                <Row label="Size" value={unit.size_sqm ? `${unit.size_sqm} m²` : "—"} />
                <Row label="Parking" value={unit.parking_spaces} />
                <Row label="View" value={unit.view_description || "—"} />
                <Row label="Last updated" value={new Date(unit.updated_at).toLocaleDateString()} />
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70 mb-3">Status history</p>
                {history.isLoading ? (
                  <div className="space-y-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                ) : !history.data?.length ? (
                  <p className="text-sm text-muted-foreground">No status changes recorded yet.</p>
                ) : (
                  <ol className="space-y-3">
                    {history.data.map((h: any) => (
                      <li key={h.id} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <div>
                          <p className="text-sm text-foreground">
                            {h.from_status ? `${STATUS_LABELS[h.from_status as UnitStatus]} → ` : ""}
                            {STATUS_LABELS[h.to_status as UnitStatus] ?? h.to_status}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{new Date(h.created_at).toLocaleString()}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UnitDetailSheet;
