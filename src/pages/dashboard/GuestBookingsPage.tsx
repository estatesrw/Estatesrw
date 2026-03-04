import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, Star } from "lucide-react";

const GuestBookingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviewDialog, setReviewDialog] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("accommodation_bookings")
        .select("*, room_types(name), properties(title, city), vendors(business_name)")
        .eq("guest_id", user.id)
        .order("created_at", { ascending: false });
      setBookings(data || []);
    };
    fetch();
  }, [user]);

  const cancelBooking = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking?.status !== "pending") {
      toast({ title: "Cannot cancel", description: "Only pending bookings can be cancelled.", variant: "destructive" });
      return;
    }
    await supabase.from("accommodation_bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Booking cancelled" });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
  };

  const submitReview = async () => {
    if (!reviewDialog || !user) return;
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      property_id: reviewDialog.property_id,
      booking_id: reviewDialog.id,
      rating,
      comment,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted!" });
      setReviewDialog(null);
      setRating(5);
      setComment("");
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-primary/10 text-primary";
      case "completed": return "bg-primary/10 text-primary";
      case "cancelled": return "bg-destructive/10 text-destructive";
      case "pending": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "pending": return "Awaiting Payment Verification";
      case "confirmed": return "Confirmed";
      case "completed": return "Completed";
      case "cancelled": return "Cancelled";
      default: return s;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">My Accommodation Bookings</h2>
        <p className="text-muted-foreground">Track your stays and booking status</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <CalendarCheck className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            No accommodation bookings yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">{(b as any).properties?.title}</p>
                      <Badge className={statusColor(b.status)}>{statusLabel(b.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(b as any).vendors?.business_name} · {(b as any).room_types?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.check_in} → {b.check_out} · {b.nights} nights · {b.guests} guest(s)
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      Total: ${Number(b.total_price).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Ref: {b.booking_ref}</p>
                  </div>
                  <div className="flex gap-2">
                    {b.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => cancelBooking(b.id)} className="text-destructive">
                        Cancel
                      </Button>
                    )}
                    {b.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => setReviewDialog(b)}>
                        <Star className="w-4 h-4 mr-1" /> Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!reviewDialog} onOpenChange={(o) => { if (!o) setReviewDialog(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Leave a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{(reviewDialog as any)?.properties?.title}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className="p-1">
                    <Star className={`w-6 h-6 ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." />
            </div>
            <Button onClick={submitReview} className="w-full">Submit Review</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestBookingsPage;
