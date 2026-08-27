import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ManagedUnit {
  id: string;
  property_id: string;
  building_id: string;
  floor_id: string;
  unit_code: string;
  unit_number: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  monthly_rent: number;
  deposit: number | null;
  view_description: string | null;
  parking_spaces: number;
  furnished: string;
  features: string[];
  notes: string | null;
  updated_at: string;
}

export interface ManagedBuilding {
  id: string;
  name: string;
  code: string;
  display_order: number;
  floors: { id: string; level: number; label: string | null }[];
}

export const useBuildings = (propertyId: string | null) =>
  useQuery({
    queryKey: ["pm_buildings", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buildings")
        .select("id, name, code, display_order, floors(id, level, label)")
        .eq("property_id", propertyId!)
        .order("display_order");
      if (error) throw error;
      return (data || []).map((b: any) => ({
        ...b,
        floors: [...(b.floors || [])].sort((a: any, z: any) => z.level - a.level),
      })) as ManagedBuilding[];
    },
  });

export const useUnits = (propertyId: string | null) =>
  useQuery({
    queryKey: ["pm_units", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .eq("property_id", propertyId!)
        .order("unit_code");
      if (error) throw error;
      return (data || []) as ManagedUnit[];
    },
  });
