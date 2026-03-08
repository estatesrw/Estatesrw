import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ChevronLeft, ChevronRight, Lock, CalendarCheck, Clock } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, getDay,
  addMonths, subMonths, isToday,
} from "date-fns";

type CalAvail = { id: string; unit_id: string; date: string; status: string; booking_id: string | null; price_override: number | null };

const VendorCalendar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [vendor, setVendor] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [availability, setAvailability] = useState<CalAvail[]>([]);
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState(searchParams.get("unit") || "all");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({ property_id: "", room_type_id: "", start_date: "", end_date: "", reason: "" });

  const fetchData = useCallback(async () => {
    if (!user) return;
    const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
    if (!v) return;
    setVendor(v);

    const { data: props } = await supabase.from("properties").select("id, title").eq("landlord_id", user.id);
    setProperties(props || []);

    let unitQ = supabase.from("room_types").select("id, name, property_id, properties(title)").eq("vendor_id", v.id);
    if (selectedProperty !== "all") unitQ = unitQ.eq("property_id", selectedProperty);
    const { data: u } = await unitQ;
    setUnits(u || []);

    // Fetch calendar_availability for the current month view
    const monthStart = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const unitIds = (u || []).map(unit => unit.id);
    if (unitIds.length > 0) {
      const { data: avail } = await supabase
        .from("calendar_availability")
        .select("*")
        .in("unit_id", unitIds)
        .gte("date", monthStart)
        .lte("date", monthEnd);
      setAvailability((avail as CalAvail[]) || []);
    } else {
      setAvailability([]);
    }

    // Fetch blocked dates and bookings for fallback
    const { data: blocked } = await supabase.from("blocked_dates").select("*, properties(title)").eq("vendor_id", v.id);
    setBlockedDates(blocked || []);

    const { data: bks } = await supabase
      .from("accommodation_bookings")
      .select("*, properties(title), room_types(name)")
      .eq("vendor_id", v.id)
      .in("status", ["confirmed", "pending", "checked_in"])
      .gte("check_out", monthStart)
      .lte("check_in", monthEnd);
    setBookings(bks || []);
  }, [user, selectedProperty, currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Filter units by selected unit
  const filteredUnits = selectedUnit !== "all" ? units.filter(u => u.id === selectedUnit) : units;

  // Build calendar data
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  // Get status for a specific unit on a specific day
  const getDayStatus = (unitId: string, dateStr: string): string => {
    // First check calendar_availability table
    const avail = availability.find(a => a.unit_id === unitId && a.date === dateStr);
    if (avail) return avail.status;

    // Fallback: check bookings
    const hasBooking = bookings.some(b =>
      b.room_type_id === unitId && b.status === "confirmed" && dateStr >= b.check_in && dateStr <= b.check_out
    );
    if (hasBooking) return "booked";

    const hasPending = bookings.some(b =>
      b.room_type_id === unitId && b.status === "pending" && dateStr >= b.check_in && dateStr <= b.check_out
    );
    if (hasPending) return "pending";

    // Check blocked
    const isBlocked = blockedDates.some(bd => {
      if (bd.room_type_id && bd.room_type_id !== unitId) return false;
      return dateStr >= bd.start_date && dateStr <= bd.end_date;
    });
    if (isBlocked) return "blocked";

    return "available";
  };

  // Get aggregated status across all filtered units
  const getAggregatedDayStatus = (dateStr: string): string => {
    if (filteredUnits.length === 0) return "available";
    const statuses = filteredUnits.map(u => getDayStatus(u.id, dateStr));
    if (statuses.every(s => s === "booked")) return "booked";
    if (statuses.every(s => s === "blocked")) return "blocked";
    if (statuses.some(s => s === "booked")) return "partial_booked";
    if (statuses.some(s => s === "pending")) return "pending";
    if (statuses.some(s => s === "blocked")) return "partial_blocked";
    return "available";
  };

  const statusStyles: Record<string, string> = {
    available: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/25 cursor-pointer",
    booked: "bg-destructive/15 text-destructive border-destructive/20",
    pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    blocked: "bg-muted text-muted-foreground border-border",
    partial_booked: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20",
    partial_blocked: "bg-slate-300/30 text-muted-foreground border-border",
    checked_in: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  };

  const statusLabels: Record<string, string> = {
    available: "Available", booked: "Booked", pending: "Pending", blocked: "Blocked",
    partial_booked: "Partial", partial_blocked: "Partial Block", checked_in: "Checked In",
  };

  // Toggle day availability (only for single unit)
  const toggleDayStatus = async (unitId: string, dateStr: string, currentStatus: string) => {
    if (!vendor) return;
    if (currentStatus === "booked" || currentStatus === "checked_in") return; // Can't toggle booked days

    const newStatus = currentStatus === "available" ? "blocked" : "available";

    const existing = availability.find(a => a.unit_id === unitId && a.date === dateStr);
    if (existing) {
      await supabase.from("calendar_availability").update({ status: newStatus }).eq("id", existing.id);
    } else {
      await supabase.from("calendar_availability").insert({ unit_id: unitId, date: dateStr, status: newStatus });
    }
    toast({ title: `Date ${newStatus === "blocked" ? "blocked" : "unblocked"}` });
    fetchData();
  };

  // Block dates
  const handleBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor || !blockForm.property_id) return;
    const { error } = await supabase.from("blocked_dates").insert({
      ...blockForm,
      vendor_id: vendor.id,
      room_type_id: blockForm.room_type_id || null,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Dates blocked" });
    setBlockDialogOpen(false);
    setBlockForm({ property_id: "", room_type_id: "", start_date: "", end_date: "", reason: "" });
    fetchData();
  };

  const removeBlock = async (id: string) => {
    await supabase.from("blocked_dates").delete().eq("id", id);
    toast({ title: "Block removed" });
    fetchData();
  };

  if (!vendor) return <div className="text-center py-20 text-muted-foreground">Register as a vendor first.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Availability Calendar</h2>
          <p className="text-muted-foreground text-sm">Manage availability per unit. Click a day to toggle block/unblock.</p>
        </div>
        <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="w-4 h-4 mr-1" /> Block Dates</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Block Date Range</DialogTitle></DialogHeader>
            <form onSubmit={handleBlock} className="space-y-4">
              <div className="space-y-2">
                <Label>Property *</Label>
                <Select value={blockForm.property_id} onValueChange={(v) => setBlockForm({ ...blockForm, property_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>{properties.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Unit (optional – blocks all if empty)</Label>
                <Select value={blockForm.room_type_id} onValueChange={(v) => setBlockForm({ ...blockForm, room_type_id: v })}>
                  <SelectTrigger><SelectValue placeholder="All units" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All units</SelectItem>
                    {units.filter(u => !blockForm.property_id || u.property_id === blockForm.property_id).map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={blockForm.start_date} onChange={(e) => setBlockForm({ ...blockForm, start_date: e.target.value })} required /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" value={blockForm.end_date} onChange={(e) => setBlockForm({ ...blockForm, end_date: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Reason</Label><Input value={blockForm.reason} onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })} placeholder="e.g. Renovation" /></div>
              <Button type="submit" className="w-full">Block Dates</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedProperty} onValueChange={(v) => { setSelectedProperty(v); setSelectedUnit("all"); }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Properties" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Properties</SelectItem>
            {properties.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedUnit} onValueChange={setSelectedUnit}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Units" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Units ({filteredUnits.length})</SelectItem>
            {units.map(u => <SelectItem key={u.id} value={u.id}>{u.name} — {(u as any).properties?.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Available", color: "bg-emerald-500/20 border-emerald-500/30" },
          { label: "Booked", color: "bg-destructive/20 border-destructive/30" },
          { label: "Pending", color: "bg-amber-500/20 border-amber-500/30" },
          { label: "Blocked", color: "bg-muted border-border" },
          { label: "Checked In", color: "bg-blue-500/20 border-blue-500/30" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded border ${l.color}`} />
            <span className="text-[11px] text-muted-foreground font-medium">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <Card className="shadow-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="font-display text-lg">{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          {selectedUnit !== "all" ? (
            // Single unit view — clickable days
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1.5">{d}</div>
              ))}
              {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const dateStr = format(day, "yyyy-MM-dd");
                const status = getDayStatus(selectedUnit, dateStr);
                const today = isToday(day);
                return (
                  <Tooltip key={dateStr}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleDayStatus(selectedUnit, dateStr, status)}
                        disabled={status === "booked" || status === "checked_in"}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${statusStyles[status]} ${today ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}
                      >
                        <span>{format(day, "d")}</span>
                        {status === "blocked" && <Lock className="w-2.5 h-2.5 mt-0.5" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{format(day, "MMM d")} — {statusLabels[status] || status}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            // Multi-unit aggregated view
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1.5">{d}</div>
              ))}
              {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
              {days.map(day => {
                const dateStr = format(day, "yyyy-MM-dd");
                const status = getAggregatedDayStatus(dateStr);
                const today = isToday(day);
                return (
                  <Tooltip key={dateStr}>
                    <TooltipTrigger asChild>
                      <div className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all ${statusStyles[status]} ${today ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}`}>
                        <span>{format(day, "d")}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs">{format(day, "MMM d")} — {statusLabels[status] || status}</p>
                      <p className="text-[10px] text-muted-foreground">Select a unit to edit availability</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sidebar panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocked dates */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2"><Lock className="w-4 h-4" /> Blocked Dates</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">No blocked dates.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {blockedDates.map((bd) => (
                  <div key={bd.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{(bd as any).properties?.title}</p>
                      <p className="text-xs text-muted-foreground">{bd.start_date} → {bd.end_date} {bd.reason && `· ${bd.reason}`}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeBlock(bd.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming bookings */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2"><CalendarCheck className="w-4 h-4" /> Bookings This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-center text-muted-foreground py-6 text-sm">No bookings this month.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{b.guest_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(b as any).room_types?.name} · {b.check_in} → {b.check_out}
                      </p>
                    </div>
                    <Badge className={
                      b.status === "confirmed" ? "bg-emerald-500/10 text-emerald-600" :
                      b.status === "checked_in" ? "bg-blue-500/10 text-blue-600" :
                      "bg-amber-500/10 text-amber-600"
                    }>{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorCalendar;
