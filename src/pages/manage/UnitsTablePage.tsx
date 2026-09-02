import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import UnitDetailSheet from "@/components/manage/UnitDetailSheet";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useBuildings, useUnits, ManagedUnit } from "@/hooks/useUnits";
import { STATUS_LABELS, UNIT_STATUSES, UnitStatus, statusStyle, formatMoney } from "@/lib/unitStatus";

const ALL = "all";

const UnitsTablePage = () => {
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const { data: buildings = [] } = useBuildings(propertyId);
  const { data: units = [], isLoading } = useUnits(propertyId);
  const currency = property?.currency || "RWF";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [building, setBuilding] = useState(ALL);
  const [selected, setSelected] = useState<ManagedUnit | null>(null);

  const buildingName = (id: string) => buildings.find((b) => b.id === id)?.name || "—";
  const floorLevel = (unit: ManagedUnit) =>
    buildings.flatMap((b) => b.floors).find((f) => f.id === unit.floor_id)?.level ?? "—";

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return units.filter((u) => {
      if (status !== ALL && u.status !== status) return false;
      if (building !== ALL && u.building_id !== building) return false;
      if (q && !u.unit_code.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [units, search, status, building]);

  const exportCsv = () => {
    const header = ["Unit code", "Building", "Floor", "Status", "Bedrooms", "Bathrooms", "Size (sqm)", "Monthly rent", "Deposit", "Parking", "Furnished"];
    const body = rows.map((u) => [
      u.unit_code, buildingName(u.building_id), floorLevel(u), STATUS_LABELS[u.status as UnitStatus] || u.status,
      u.bedrooms, u.bathrooms, u.size_sqm ?? "", u.monthly_rent, u.deposit ?? "", u.parking_spaces, u.furnished,
    ]);
    const csv = [header, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${property?.code || "units"}-units.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Units Register | EstatesRW Management</title>
        <meta name="description" content="Full register of managed units with rent, size, status and CSV export for reporting." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Units Register</h2>
          <p className="text-muted-foreground text-sm">{rows.length} of {units.length} units shown</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
          <Button variant="outline" className="rounded-full" onClick={exportCsv} disabled={!rows.length}>
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search unit code" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-full" />
        </div>
        <Select value={building} onValueChange={setBuilding}>
          <SelectTrigger className="rounded-full sm:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All buildings</SelectItem>
            {buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-full sm:w-[190px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {UNIT_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : !rows.length ? (
          <div className="p-10 text-center text-sm text-muted-foreground">No units match these filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unit</TableHead><TableHead>Building</TableHead><TableHead>Floor</TableHead>
                  <TableHead>Beds</TableHead><TableHead>Baths</TableHead><TableHead>Size</TableHead>
                  <TableHead>Rent</TableHead><TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id} className="cursor-pointer" onClick={() => setSelected(u)}>
                    <TableCell className="font-medium">{u.unit_code}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{buildingName(u.building_id)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{floorLevel(u)}</TableCell>
                    <TableCell>{u.bedrooms}</TableCell>
                    <TableCell>{u.bathrooms}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.size_sqm ? `${u.size_sqm} m²` : "—"}</TableCell>
                    <TableCell>{formatMoney(Number(u.monthly_rent), currency)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="status-chip" style={statusStyle(u.status)}>
                        {STATUS_LABELS[u.status as UnitStatus] || u.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <UnitDetailSheet unit={selected} currency={currency} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
};

export default UnitsTablePage;
