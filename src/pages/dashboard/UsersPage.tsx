import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (!profiles) return;

      // Fetch roles for all users
      const userIds = profiles.map((p) => p.id);
      const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("user_id", userIds);

      const roleMap: Record<string, string[]> = {};
      roles?.forEach((r) => {
        if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
        roleMap[r.user_id].push(r.role);
      });

      setUsers(profiles.map((p) => ({ ...p, roles: roleMap[p.id] || [] })));
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Users</h2>
        <p className="text-muted-foreground">Manage platform users</p>
      </div>

      {users.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No users found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <Card key={u.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{u.full_name || "Unnamed User"}</p>
                  <p className="text-sm text-muted-foreground">{u.phone_number || "No phone"} · Joined {new Date(u.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-1">
                  {u.roles.map((r: string) => (
                    <Badge key={r} className="bg-primary/10 text-primary">{r}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
