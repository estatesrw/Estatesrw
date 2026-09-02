import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Layers, Home, Plus } from "lucide-react";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useBuildings, useUnits } from "@/hooks/useUnits";
import { formatMoney } from "@/lib/unitStatus";

const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const PropertySetupPage = () => {
  const queryClient = useQueryClient();
  const { properties, propertyId, setPropertyId, property, isLoading } = usePmProperties();
  const { data: buildings = [] } = useBuildings(propertyId);
  const { data: units = [] } = useUnits(propertyId);
  const currency = property?.currency || "RWF";

  const [prop, setProp] = useState({ name: "", code: "", address: "", city: "Kigali", country: "Rwanda", currency: "RWF" });
  const [bld, setBld] = useState({ name: "", code: "" });
  const [flr, setFlr] = useState({ building_id: "", level: "", label: "" });
  const [unit, setUnit] = useState({ building_id: "", floor_id: "", unit_number: "", bedrooms: "1", bathrooms: "1", size_sqm: "", monthly_rent: "" });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["pm_properties"] });
    queryClient.invalidateQueries({ queryKey: ["pm_buildings"] });
    queryClient.invalidateQueries({ queryKey: ["pm_units"] });
  };

  const createProperty = useMutation({
    mutationFn: async () => {
      const organization_id = properties[0]?.organization_id;
      if (!organization_id) throw new Error("No organization available — ask an admin to create one first");
      if (!prop.name || !prop.code || !prop.address) throw new Error("Name, code and address are required");
      const { error } = await supabase.from("pm_properties").insert({
        organization_id, name: prop.name, code: prop.code.toUpperCase(), address: prop.address,
        city: prop.city, country: prop.country, currency: prop.currency, status: "active",
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Property created"); setProp({ ...prop, name: "", code: "", address: "" }); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Could not create the property"),
  });

  const createBuilding = useMutation({
    mutationFn: async () => {
      if (!propertyId) throw new Error("Select a property first");
      if (!bld.name || !bld.code) throw new Error("Building name and code are required");
      const { error } = await supabase.from("buildings").insert({
        property_id: propertyId, name: bld.name, code: bld.code.toUpperCase(), display_order: buildings.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Building added"); setBld({ name: "", code: "" }); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Could not add the building"),
  });

  const createFloor = useMutation({
    mutationFn: async () => {
      if (!flr.building_id || !flr.level) throw new Error("Pick a building and a floor level");
      const { error } = await supabase.from("floors").insert({
        building_id: flr.building_id, level: Number(flr.level), label: flr.label || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Floor added"); setFlr({ ...flr, level: "", label: "" }); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Could not add the floor"),
  });

  const createUnit = useMutation({
    mutationFn: async () => {
      if (!unit.building_id || !unit.floor_id || !unit.unit_number) throw new Error("Building, floor and unit number are required");
      const { error } = await supabase.from("units").insert({
        property_id: propertyId!, building_id: unit.building_id, floor_id: unit.floor_id,
        unit_code: "", unit_number: unit.unit_number, status: "available",
        bedrooms: Number(unit.bedrooms) || 1, bathrooms: Number(unit.bathrooms) || 1,
        size_sqm: unit.size_sqm ? Number(unit.size_sqm) : null,
        monthly_rent: Number(unit.monthly_rent) || 0,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Unit added — code generated automatically"); setUnit({ ...unit, unit_number: "", size_sqm: "" }); invalidate(); },
    onError: (e: any) => toast.error(e.message || "Could not add the unit"),
  });

  const floorsFor = (buildingId: string) => buildings.find((b) => b.id === buildingId)?.floors || [];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Property Setup | EstatesRW Management</title>
        <meta name="description" content="Configure managed properties, buildings, floors and units with automatic unit code generation." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Property Setup</h2>
          <p className="text-muted-foreground text-sm">Build the portfolio hierarchy: property → building → floor → unit.</p>
        </div>
        <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
      </div>

      {isLoading ? (
        <Skeleton className="h-40 rounded-3xl" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="New property" icon={<Building2 className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={prop.name} onChange={(e) => setProp({ ...prop, name: e.target.value })} /></div>
              <div><Label>Code</Label><Input value={prop.code} onChange={(e) => setProp({ ...prop, code: e.target.value })} placeholder="HGR" /></div>
              <div className="col-span-2"><Label>Address</Label><Input value={prop.address} onChange={(e) => setProp({ ...prop, address: e.target.value })} /></div>
              <div><Label>City</Label><Input value={prop.city} onChange={(e) => setProp({ ...prop, city: e.target.value })} /></div>
              <div><Label>Country</Label><Input value={prop.country} onChange={(e) => setProp({ ...prop, country: e.target.value })} /></div>
            </div>
            <Button className="rounded-full w-full" onClick={() => createProperty.mutate()} disabled={createProperty.isPending}>
              <Plus className="w-4 h-4 mr-1.5" /> Create property
            </Button>
          </Card>

          <Card title="Add building" icon={<Building2 className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Building name</Label><Input value={bld.name} onChange={(e) => setBld({ ...bld, name: e.target.value })} placeholder="Block B" /></div>
              <div><Label>Code</Label><Input value={bld.code} onChange={(e) => setBld({ ...bld, code: e.target.value })} placeholder="B" /></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {buildings.length} building{buildings.length === 1 ? "" : "s"} · {units.length} units · rent roll {formatMoney(units.reduce((s, u) => s + Number(u.monthly_rent), 0), currency)}
            </p>
            <Button className="rounded-full w-full" onClick={() => createBuilding.mutate()} disabled={!propertyId || createBuilding.isPending}>
              <Plus className="w-4 h-4 mr-1.5" /> Add building
            </Button>
          </Card>

          <Card title="Add floor" icon={<Layers className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Building</Label>
                <Select value={flr.building_id} onValueChange={(v) => setFlr({ ...flr, building_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select building" /></SelectTrigger>
                  <SelectContent>{buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Level</Label><Input type="number" value={flr.level} onChange={(e) => setFlr({ ...flr, level: e.target.value })} /></div>
              <div><Label>Label</Label><Input value={flr.label} onChange={(e) => setFlr({ ...flr, label: e.target.value })} placeholder="Ground" /></div>
            </div>
            <Button className="rounded-full w-full" onClick={() => createFloor.mutate()} disabled={createFloor.isPending}>
              <Plus className="w-4 h-4 mr-1.5" /> Add floor
            </Button>
          </Card>

          <Card title="Add unit" icon={<Home className="w-5 h-5" />}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Building</Label>
                <Select value={unit.building_id} onValueChange={(v) => setUnit({ ...unit, building_id: v, floor_id: "" })}>
                  <SelectTrigger><SelectValue placeholder="Building" /></SelectTrigger>
                  <SelectContent>{buildings.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Floor</Label>
                <Select value={unit.floor_id} onValueChange={(v) => setUnit({ ...unit, floor_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Floor" /></SelectTrigger>
                  <SelectContent>
                    {floorsFor(unit.building_id).map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.label || `Level ${f.level}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Unit number</Label><Input value={unit.unit_number} onChange={(e) => setUnit({ ...unit, unit_number: e.target.value })} placeholder="01" /></div>
              <div><Label>Monthly rent ({currency})</Label><Input type="number" value={unit.monthly_rent} onChange={(e) => setUnit({ ...unit, monthly_rent: e.target.value })} /></div>
              <div><Label>Bedrooms</Label><Input type="number" value={unit.bedrooms} onChange={(e) => setUnit({ ...unit, bedrooms: e.target.value })} /></div>
              <div><Label>Bathrooms</Label><Input type="number" value={unit.bathrooms} onChange={(e) => setUnit({ ...unit, bathrooms: e.target.value })} /></div>
              <div className="col-span-2"><Label>Size (m²)</Label><Input type="number" value={unit.size_sqm} onChange={(e) => setUnit({ ...unit, size_sqm: e.target.value })} /></div>
            </div>
            <Button className="rounded-full w-full" onClick={() => createUnit.mutate()} disabled={!propertyId || createUnit.isPending}>
              <Plus className="w-4 h-4 mr-1.5" /> Add unit
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PropertySetupPage;
