import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Layers, RotateCcw, Building2 } from "lucide-react";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useBuildings, useUnits, ManagedUnit } from "@/hooks/useUnits";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import UnitCard from "@/components/manage/UnitCard";
import UnitDetailSheet from "@/components/manage/UnitDetailSheet";
import { STATUS_LABELS, UNIT_STATUSES, UnitStatus, statusStyle, OCCUPIED_STATUSES } from "@/lib/unitStatus";

const ALL = "all";

const OccupancyMap = () => {
  const { properties, propertyId, setPropertyId, property, isLoading: loadingProps } = usePmProperties();
  const { data: buildings = [], isLoading: loadingBuildings } = useBuildings(propertyId);
  const { data: units = [], isLoading: loadingUnits } = useUnits(propertyId);

  const [building, setBuilding] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [beds, setBeds] = useState(ALL);
  const [maxRent, setMaxRent] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ManagedUnit | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rentCap = Number(maxRent) || Infinity;
    return units.filter((u) => {
      if (building !== ALL && u.building_id !== building) return false;
      if (status !== ALL && u.status !== status) return false;
      if (beds !== ALL && u.bedrooms !== Number(beds)) return false;
      if (Number(u.monthly_rent) > rentCap) return false;
      if (q && !u.unit_code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [units, building, status, beds, maxRent, search]);

  const stats = useMemo(() => {
    const total = units.length;
    const occupied = units.filter((u) => OCCIndexes(u.status)).length;
    return { total, occupied, rate: total ? Math.round((occupied / total) * 100) : 0 };
  }, [units]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    units.forEach((u) => { map[u.status] = (map[u.status] || 0) + 1; });
    return map;
  }, [units]);

  const visibleBuildings = building === ALL ? buildings : buildings.filter((b) => b.id === building);
  const reset = () => { setBuilding(ALL); setStatus(ALL); setBeds(ALL); setMaxRent(""); setSearch(""); };
  const bedOptions = Array.from(new Set(units.map((u) => u.bedrooms))).sort((a, b) => a - b);
  const loading = loadingProps || loadingBuildings || loadingUnits;

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Occupancy Map | EstatesRW Property Management</title>
        <meta name="description" content="Interactive floor-by-floor occupancy map for managed properties: unit status, rent, filters and lifecycle updates." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Occupancy Map</h2>
          <p className="text-muted-foreground text-sm">
            {property ? `${property.name} — ${property.address}, ${property.city}` : "Select a property to begin."}
          </p>
        </div>
        <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
      </div>

      {!loading && !properties.length && (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <Building2 className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-display text-lg font-semibold text-foreground">No managed properties yet</p>
          <p className="text-sm text-muted-foreground">Create a property, buildings and floors to build your occupancy map.</p>
        </div>
      )}

      {!!properties.length && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Total units</p>
              <p className="font-display text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Occupied</p>
              <p className="font-display text-2xl font-bold text-foreground">{stats.occupied}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Occupancy</p>
              <p className="font-display text-2xl font-bold text-primary">{stats.rate}%</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">Showing</p>
              <p className="font-display text-2xl font-bold text-foreground">{filtered.length}</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            {UNIT_STATUSES.filter((s) => counts[s]).map((s) => (
              <button key={s} onClick={() => setStatus(status === s ? ALL : s)} style={statusStyle(s)}
                className={`status-chip border ${status === s ? "border-foreground/30" : "border-transparent"}`}>
                <span className="w-1.5 h-1.5 rounded-full status-dot" />
                {STATUS_LABELS[s]} · {counts[s]}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="rounded-3xl border border-border bg-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9 rounded-full" placeholder="Search unit ID" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={building} onValueChange={setBuilding}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Building" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All buildings</SelectItem>
                {buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {UNIT_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={beds} onValueChange={setBeds}>
              <SelectTrigger className="rounded-full"><SelectValue placeholder="Bedrooms" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Any bedrooms</SelectItem>
                {bedOptions.map((b) => <SelectItem key={b} value={String(b)}>{b} bed</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input className="rounded-full" type="number" placeholder="Max rent" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} />
              <Button variant="outline" size="icon" className="rounded-full shrink-0" onClick={reset} aria-label="Reset filters">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}</div>
          ) : (
            <div className="space-y-8">
              {visibleBuildings.map((b) => (
                <section key={b.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">{b.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {filtered.filter((u) => u.building_id === b.id).length} units shown
                    </span>
                  </div>
                  <div className="space-y-3">
                    {b.floors.map((f) => {
                      const floorUnits = filtered.filter((u) => u.floor_id === f.id);
                      if (!floorUnits.length) return null;
                      return (
                        <div key={f.id} className="rounded-3xl border border-border bg-card p-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-foreground">{f.label || `Floor ${f.level}`}</p>
                            <p className="text-[11px] text-muted-foreground">{floorUnits.length} units</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                            {floorUnits.map((u) => (
                              <UnitCard key={u.id} unit={u} currency={property?.currency || "RWF"} onClick={() => setSelected(u)} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
              {!filtered.length && (
                <div className="rounded-3xl border border-dashed border-border p-10 text-center">
                  <p className="font-display text-lg font-semibold text-foreground">No units match these filters</p>
                  <Button variant="outline" className="mt-3 rounded-full" onClick={reset}>Clear filters</Button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <UnitDetailSheet
        unit={selected}
        currency={property?.currency || "RWF"}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
};

const OCCIndexes = (status: string) => OCCUPIED_STATUSES.includes(status as UnitStatus);

export default OccupancyMap;
