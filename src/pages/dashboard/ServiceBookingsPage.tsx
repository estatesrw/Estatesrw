import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ServiceBookingsPage = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const isProvider = roles.includes("service_provider");
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    let query = supabase.from("service_bookings").select("*, services(title, category, price)").order("created_at", { ascending: false });
    if (isProvider) {
      query = query.eq("provider_id", user!.id);
    } else {
      query = query.eq("customer_id", user!.id);
    }
    const { data } = await query;
    setBookings(data || []);
  };

  useEffect(() => { if (user) fetchBookings(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("service_bookings").update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Booking ${status}` }); fetchBookings(); }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          {isProvider ? "Service Requests" : "My Service Bookings"}
        </h2>
        <p className="text-muted-foreground">
          {isProvider ? "Manage incoming service requests" : "Track your booked services"}
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No service bookings found.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display font-semibold text-foreground">{b.services?.title || "Service"}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status] || "bg-muted text-muted-foreground"}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{b.scheduled_date}</span>
                      {b.scheduled_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.scheduled_time}</span>}
                      <span className="font-medium text-foreground">RWF {Number(b.total_price).toLocaleString()}</span>
                    </div>
                    {b.notes && <p className="text-sm text-muted-foreground mt-2">{b.notes}</p>}
                  </div>
                  {isProvider && b.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateStatus(b.id, "confirmed")}>
                        <CheckCircle className="w-3 h-3 mr-1" />Accept
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive" onClick={() => updateStatus(b.id, "cancelled")}>
                        <XCircle className="w-3 h-3 mr-1" />Decline
                      </Button>
                    </div>
                  )}
                  {isProvider && b.status === "confirmed" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(b.id, "completed")}>
                      <CheckCircle className="w-3 h-3 mr-1" />Mark Complete
                    </Button>
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

export default ServiceBookingsPage;
