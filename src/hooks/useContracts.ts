import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Contract {
  id: string;
  property_id: string;
  unit_id: string | null;
  lease_id: string | null;
  tenant_id: string | null;
  landlord_id: string | null;
  created_by: string | null;
  title: string;
  contract_type: string;
  tenant_name: string;
  landlord_name: string | null;
  manager_name: string | null;
  currency: string;
  monthly_rent: number;
  deposit: number;
  management_fee_percent: number;
  start_date: string | null;
  end_date: string | null;
  content: string;
  input_details: any;
  status: string;
  created_at: string;
  units?: { unit_code: string } | null;
  pm_properties?: { name: string; address: string; city: string } | null;
}

export interface ContractSignature {
  id: string;
  contract_id: string;
  user_id: string;
  signer_role: string;
  signer_name: string;
  typed_signature: string;
  signed_at: string;
}

/** All contracts the signed-in user is allowed to see (RLS scoped). */
export const useContracts = (propertyId?: string | null) =>
  useQuery({
    queryKey: ["contracts", propertyId ?? "all"],
    queryFn: async () => {
      let q = supabase
        .from("contracts")
        .select("*, units(unit_code), pm_properties(name, address, city)")
        .order("created_at", { ascending: false });
      if (propertyId) q = q.eq("property_id", propertyId);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as Contract[];
    },
  });

export const useContractSignatures = (contractId: string | null) =>
  useQuery({
    queryKey: ["contract_signatures", contractId],
    enabled: !!contractId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contract_signatures")
        .select("*")
        .eq("contract_id", contractId!)
        .order("signed_at");
      if (error) throw error;
      return (data || []) as unknown as ContractSignature[];
    },
  });
