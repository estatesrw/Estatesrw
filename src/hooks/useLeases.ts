import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Lease {
  id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  tenant_name: string;
  tenant_email: string | null;
  tenant_phone: string | null;
  start_date: string;
  end_date: string | null;
  monthly_rent: number;
  deposit: number;
  payment_day: number;
  status: string;
  notes: string | null;
  units?: { unit_code: string } | null;
}

export interface RentInvoice {
  id: string;
  lease_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  period_start: string;
  due_date: string;
  amount: number;
  amount_paid: number;
  status: string;
  reference: string | null;
  paid_at: string | null;
  units?: { unit_code: string } | null;
  leases?: { tenant_name: string } | null;
}

export const useLeases = (propertyId: string | null) =>
  useQuery({
    queryKey: ["pm_leases", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("*, units(unit_code)")
        .eq("property_id", propertyId!)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Lease[];
    },
  });

export const useRentInvoices = (propertyId: string | null) =>
  useQuery({
    queryKey: ["pm_invoices", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rent_invoices")
        .select("*, units(unit_code), leases(tenant_name)")
        .eq("property_id", propertyId!)
        .order("due_date", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as RentInvoice[];
    },
  });

/** The signed-in tenant's active lease with unit + property context. */
export const useMyLease = (userId: string | undefined) =>
  useQuery({
    queryKey: ["my_lease", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leases")
        .select("*, units(unit_code, bedrooms, bathrooms, size_sqm, status, view_description, features), pm_properties(name, address, city, country, currency)")
        .eq("tenant_id", userId!)
        .order("start_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

export const useMyInvoices = (userId: string | undefined) =>
  useQuery({
    queryKey: ["my_invoices", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rent_invoices")
        .select("*")
        .eq("tenant_id", userId!)
        .order("due_date", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as RentInvoice[];
    },
  });

export const useAuditLog = (propertyId: string | null) =>
  useQuery({
    queryKey: ["pm_audit", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, old_value, new_value, created_at, user_id")
        .eq("property_id", propertyId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
