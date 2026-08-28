import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "tenant" | "landlord" | "service_provider" | "admin" | "vendor" | "agent";

export interface DirectoryUser {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  created_at: string;
  roles: AppRole[];
}

/** All platform users with their roles. Only returns rows the caller is allowed to read. */
export const useDirectory = () =>
  useQuery({
    queryKey: ["directory"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("id, full_name, phone_number, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      const roleMap: Record<string, AppRole[]> = {};
      (rolesRes.data || []).forEach((r) => {
        roleMap[r.user_id] = [...(roleMap[r.user_id] || []), r.role as AppRole];
      });
      return (profilesRes.data || []).map((p) => ({ ...p, roles: roleMap[p.id] || [] })) as DirectoryUser[];
    },
  });

export const usePropertyAssignments = (propertyId: string | null) =>
  useQuery({
    queryKey: ["property_assignments", propertyId],
    enabled: !!propertyId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_assignments")
        .select("id, user_id, assignment_role, created_at")
        .eq("property_id", propertyId!);
      if (error) throw error;
      return data || [];
    },
  });
