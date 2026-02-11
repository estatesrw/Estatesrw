import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ApplicationsPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isLandlord = roles.includes("landlord");
  const isAdmin = roles.includes("admin");
  const [applications, setApplications] = useState<any[]>([]);

  const fetchApplications = async () => {
    if (!user) return;
    let query = supabase.from("applications").select("*, properties(title, city, address)").order("created_at", { ascending: false });
    if (!isAdmin && !isLandlord) query = query.eq("tenant_id", user.id);
    const { data } = await query;
    setApplications(data || []);
  };

  useEffect(() => { fetchApplications(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Application ${status}` }); fetchApplications(); }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "approved": return "bg-primary/10 text-primary";
      case "rejected": return "bg-destructive/10 text-destructive";
      default: return "bg-accent/20 text-accent-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Applications</h2>
        <p className="text-muted-foreground">{isLandlord ? "Review tenant applications" : "Your rental applications"}</p>
      </div>

      {applications.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No applications found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {applications.map((a) => (
            <Card key={a.id} className="shadow-card">
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-foreground">{(a.properties as any)?.title}</h3>
                  <p className="text-sm text-muted-foreground">{(a.properties as any)?.city} · Applied {new Date(a.created_at).toLocaleDateString()}</p>
                  {a.message && <p className="text-sm text-muted-foreground mt-1 italic">"{a.message}"</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColor(a.status)}>{a.status}</Badge>
                  {isLandlord && a.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(a.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "rejected")}>Reject</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
