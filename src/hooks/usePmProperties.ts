import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PmProperty {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  status: string;
  cover_image: string | null;
  unit_id_format: string;
  organization_id: string;
}

const STORAGE_KEY = "estatesrw.manage.propertyId";

export const usePmProperties = () => {
  const query = useQuery({
    queryKey: ["pm_properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pm_properties")
        .select("id, name, code, address, city, country, currency, status, cover_image, unit_id_format, organization_id")
        .order("name");
      if (error) throw error;
      return (data || []) as PmProperty[];
    },
  });

  const [propertyId, setPropertyIdState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    const list = query.data;
    if (!list?.length) return;
    if (!propertyId || !list.some((p) => p.id === propertyId)) {
      setPropertyIdState(list[0].id);
      localStorage.setItem(STORAGE_KEY, list[0].id);
    }
  }, [query.data, propertyId]);

  const setPropertyId = (id: string) => {
    setPropertyIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const property = query.data?.find((p) => p.id === propertyId) || null;

  return { ...query, properties: query.data || [], propertyId, setPropertyId, property };
};
