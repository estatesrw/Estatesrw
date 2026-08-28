import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShieldCheck, UserCog, X } from "lucide-react";
import { toast } from "sonner";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useDirectory, usePropertyAssignments, AppRole } from "@/hooks/useDirectory";

const PLATFORM_ROLES: AppRole[] = ["tenant", "landlord", "agent", "vendor", "service_provider", "admin"];
const ASSIGNMENT_ROLES = ["manager", "agent"] as const;

const AccessControlPage = () => {
  const queryClient = useQueryClient();
  const { properties, propertyId, setPropertyId, property } = usePmProperties();
  const { data: users = [], isLoading } = useDirectory();
  const { data: assignments = [] } = usePropertyAssignments(propertyId);

  const [search, setSearch] = useState("");
  const [roleToAdd, setRoleToAdd] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => (u.full_name || "").toLowerCase().includes(q) || u.id.includes(q));
  }, [users, search]);

  const assignmentByUser = useMemo(() => {
    const map: Record<string, string[]> = {};
    assignments.forEach((a: any) => {
      map[a.user_id] = [...(map[a.user_id] || []), a.assignment_role];
    });
    return map;
  }, [assignments]);

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role granted");
      queryClient.invalidateQueries({ queryKey: ["directory"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not grant this role"),
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Role removed");
      queryClient.invalidateQueries({ queryKey: ["directory"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not remove this role"),
  });

  const assign = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: "manager" | "agent" }) => {
      const { error } = await supabase
        .from("property_assignments")
        .insert({ property_id: propertyId, user_id: userId, assignment_role: role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`Assigned to ${property?.name}`);
      queryClient.invalidateQueries({ queryKey: ["property_assignments"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not assign this user"),
  });

  const unassign = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const { error } = await supabase
        .from("property_assignments")
        .delete()
        .eq("property_id", propertyId!)
        .eq("user_id", userId)
        .eq("assignment_role", role as "manager" | "agent");
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Access revoked");
      queryClient.invalidateQueries({ queryKey: ["property_assignments"] });
    },
    onError: (e: any) => toast.error(e.message || "Could not revoke access"),
  });

  return (
    <div className="space-y-6">
      <Helmet>
        <title>People & Access | EstatesRW Management</title>
        <meta name="description" content="Grant platform roles and assign property managers, agents and tenants across your managed portfolio." />
      </Helmet>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">People & Access</h2>
          <p className="text-muted-foreground text-sm">Grant platform roles and give managers or agents access to a property.</p>
        </div>
        <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9 rounded-full" placeholder="Search people by name" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-3xl" />)}</div>
      ) : !filtered.length ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <UserCog className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
          <p className="font-display text-lg font-semibold text-foreground">No people found</p>
          <p className="text-sm text-muted-foreground">People appear here once they create an account on EstatesRW.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <div key={u.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{u.full_name || "Unnamed user"}</p>
                  <p className="text-xs text-muted-foreground">
                    {u.phone_number || "No phone"} · joined {new Date(u.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {u.roles.length === 0 && <span className="text-xs text-muted-foreground">No platform role</span>}
                    {u.roles.map((r) => (
                      <Badge key={r} variant="secondary" className="gap-1 rounded-full">
                        {r}
                        <button onClick={() => removeRole.mutate({ userId: u.id, role: r })} aria-label={`Remove ${r}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {(assignmentByUser[u.id] || []).map((a) => (
                      <Badge key={a} className="gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                        <ShieldCheck className="w-3 h-3" />
                        {property?.code} {a}
                        <button onClick={() => unassign.mutate({ userId: u.id, role: a })} aria-label={`Revoke ${a}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Select value={roleToAdd[u.id] || ""} onValueChange={(v) => setRoleToAdd((p) => ({ ...p, [u.id]: v }))}>
                    <SelectTrigger className="w-[170px] rounded-full"><SelectValue placeholder="Grant role" /></SelectTrigger>
                    <SelectContent>
                      {PLATFORM_ROLES.filter((r) => !u.roles.includes(r)).map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={!roleToAdd[u.id]}
                    onClick={() => addRole.mutate({ userId: u.id, role: roleToAdd[u.id] as AppRole })}
                  >
                    Grant
                  </Button>
                  {propertyId && ASSIGNMENT_ROLES.map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant="outline"
                      className="rounded-full capitalize"
                      disabled={(assignmentByUser[u.id] || []).includes(r)}
                      onClick={() => assign.mutate({ userId: u.id, role: r })}
                    >
                      Make {r}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessControlPage;
