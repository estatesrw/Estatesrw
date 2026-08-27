import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Home, Layers, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useUnits } from "@/hooks/useUnits";
import { STATUS_LABELS, UNIT_STATUSES, UnitStatus, statusStyle, OCCUPIED_STATUSES, formatMoney } from "@/lib/unitStatus";

const ManageOverview = () => {
  const { properties, propertyId, setPropertyId, property, isLoading } = usePmProperties();
  const { data: units = [], isLoading: loadingUnits } = useUnits(propertyId);

  const activity = useQuery({
    queryKey: ["pm_activity", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unit_status_history")
        .select("id, from_status, to_status, created_at, unit_id, units(unit_code)")
        .eq("property_id", propertyId!)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data || [];
    },
  });

  const kpis = useMemo(() => {
    const total = units.length;
    const occupiedUnits = units.filter((u) => OCCUPIED_STATUSES.includes(u.status as UnitStatus));
    const potential = units.reduce((s, u) => s + Number(u.monthly_rent), 0);
    const actual = occupiedUnits.reduce((s, u) => s + Number(u.monthly_rent), 0);
    return {
      total,
      occupancy: total ? Math.round((occupiedUnits.length / total) * 100) : 0,
      vacant: units.filter((u) => u.status === "available").length,
      potential,
      actual,
    };
  }, [units]);

  const breakdown = useMemo(() => {
    const map: Record<string, number> = {};
    units.forEach((u) => { map[u.status] = (map[u.status] || 0) + 1; });
    return UNIT_STATUSES.filter((s) => map[s]).map((s) => ({ status: s, count: map[s] }));
  }, [units]);

  const currency = property?.currency || "RWF";

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Portfolio Command Center | EstatesRW Management</title>
        <meta name="description" content="Occupancy, rent roll and unit lifecycle activity across your managed property portfolio." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Command Center</h2>
          <p className="text-muted-foreground text-sm">
            {properties.length} managed {properties.length === 1 ? "property" : "properties"} · live portfolio performance
          </p>
        </div>
        <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
      </div>

      {isLoading || loadingUnits ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28 rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard title="Total Units" value={kpis.total} icon={<Home className="w-5 h-5" />} />
          <StatsCard title="Occupancy" value={`${kpis.occupancy}%`} icon={<TrendingUp className="w-5 h-5" />} />
          <StatsCard title="Available" value={kpis.vacant} icon={<Layers className="w-5 h-5" />} />
          <StatsCard title="Rent Roll (actual)" value={formatMoney(kpis.actual, currency)} icon={<Wallet className="w-5 h-5" />} />
          <StatsCard title="Rent Roll (potential)" value={formatMoney(kpis.potential, currency)} icon={<Building2 className="w-5 h-5" />} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">Unit status breakdown</h3>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/manage/occupancy">Open map <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
            </Button>
          </div>
          {!breakdown.length ? (
            <p className="text-sm text-muted-foreground">No units yet for this property.</p>
          ) : (
            <div className="space-y-2.5">
              {breakdown.map(({ status, count }) => (
                <div key={status} style={statusStyle(status)}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground">{STATUS_LABELS[status as UnitStatus]}</span>
                    <span className="text-muted-foreground">{count} · {Math.round((count / kpis.total) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full status-dot" style={{ width: `${(count / kpis.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-5">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent unit activity</h3>
          {activity.isLoading ? (
            <div className="space-y-2">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !activity.data?.length ? (
            <p className="text-sm text-muted-foreground">No lifecycle changes recorded yet. Status updates will appear here.</p>
          ) : (
            <ol className="space-y-3">
              {activity.data.map((a: any) => (
                <li key={a.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-foreground font-medium">{a.units?.unit_code || "Unit"}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.from_status ? `${STATUS_LABELS[a.from_status as UnitStatus]} → ` : ""}
                      {STATUS_LABELS[a.to_status as UnitStatus] ?? a.to_status}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{new Date(a.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOverview;
