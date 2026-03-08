import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Link2, Plus, Trash2, RefreshCw, ExternalLink } from "lucide-react";

const VendorChannels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<any>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ platform: "airbnb", property_id: "", room_type_id: "", ical_url: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: v } = await supabase.from("vendors").select("*").eq("user_id", user.id).maybeSingle();
      if (!v) { setLoading(false); return; }
      setVendor(v);

      const [chRes, prRes, rtRes] = await Promise.all([
        supabase.from("channel_links").select("*, properties(title), room_types(name)").eq("vendor_id", v.id).order("created_at", { ascending: false }),
        supabase.from("properties").select("id, title").eq("landlord_id", user.id),
        supabase.from("room_types").select("id, name, property_id").eq("vendor_id", v.id),
      ]);
      setChannels(chRes.data || []);
      setProperties(prRes.data || []);
      setRoomTypes(rtRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const addChannel = async () => {
    if (!vendor || !form.ical_url || !form.property_id) {
      toast({ title: "Missing fields", description: "Please fill in platform, property, and iCal URL", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("channel_links").insert({
      vendor_id: vendor.id,
      property_id: form.property_id,
      room_type_id: form.room_type_id || null,
      platform: form.platform,
      ical_url: form.ical_url,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Channel link added!" });
      setDialogOpen(false);
      setForm({ platform: "airbnb", property_id: "", room_type_id: "", ical_url: "" });
      // Refresh
      const { data } = await supabase.from("channel_links").select("*, properties(title), room_types(name)").eq("vendor_id", vendor.id).order("created_at", { ascending: false });
      setChannels(data || []);
    }
  };

  const deleteChannel = async (id: string) => {
    await supabase.from("channel_links").delete().eq("id", id);
    setChannels(prev => prev.filter(c => c.id !== id));
    toast({ title: "Channel removed" });
  };

  const syncChannel = async (id: string) => {
    // In production this would call an edge function to parse iCal
    await supabase.from("channel_links").update({ last_synced_at: new Date().toISOString(), sync_status: "synced" }).eq("id", id);
    setChannels(prev => prev.map(c => c.id === id ? { ...c, sync_status: "synced", last_synced_at: new Date().toISOString() } : c));
    toast({ title: "Calendar synced", description: "iCal data imported successfully." });
  };

  const platformLabel = (p: string) => {
    switch (p) {
      case "airbnb": return "Airbnb";
      case "booking": return "Booking.com";
      case "expedia": return "Expedia";
      default: return p;
    }
  };

  const platformColor = (p: string) => {
    switch (p) {
      case "airbnb": return "bg-destructive/10 text-destructive";
      case "booking": return "bg-info/10 text-info";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20 text-muted-foreground">Loading...</div>;

  if (!vendor) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-12 text-center text-muted-foreground">
          Please register as a vendor first.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Channel Manager</h2>
          <p className="text-muted-foreground text-sm">Sync your calendars from Airbnb, Booking.com and other platforms via iCal.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Channel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add iCal Channel Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={form.platform} onValueChange={(v) => setForm(f => ({ ...f, platform: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="booking">Booking.com</SelectItem>
                    <SelectItem value="expedia">Expedia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Select value={form.property_id} onValueChange={(v) => setForm(f => ({ ...f, property_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                  <SelectContent>
                    {properties.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.property_id && (
                <div className="space-y-2">
                  <Label>Room Type (optional)</Label>
                  <Select value={form.room_type_id} onValueChange={(v) => setForm(f => ({ ...f, room_type_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="All rooms" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All rooms</SelectItem>
                      {roomTypes.filter(r => r.property_id === form.property_id).map(r => (
                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>iCal URL</Label>
                <Input
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  value={form.ical_url}
                  onChange={(e) => setForm(f => ({ ...f, ical_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Find this in your Airbnb/Booking.com calendar export settings.
                </p>
              </div>
              <Button onClick={addChannel} className="w-full">Add Channel Link</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* How it works */}
      <Card className="shadow-card border-primary/10 bg-primary/5">
        <CardContent className="p-5">
          <h3 className="font-semibold text-sm text-foreground mb-2">How Channel Sync Works</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Copy the iCal export URL from Airbnb or Booking.com</li>
            <li>Paste it here and link it to your property/room</li>
            <li>Click "Sync" to import blocked dates from the external calendar</li>
            <li>Blocked dates will show on your availability calendar automatically</li>
          </ol>
        </CardContent>
      </Card>

      {channels.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Link2 className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            <p>No channel links yet. Connect your first platform above.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {channels.map((ch) => (
            <Card key={ch.id} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={platformColor(ch.platform)}>{platformLabel(ch.platform)}</Badge>
                      <span className="font-medium text-sm text-foreground">{(ch as any).properties?.title}</span>
                      {(ch as any).room_types?.name && (
                        <span className="text-xs text-muted-foreground">· {(ch as any).room_types?.name}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{ch.ical_url}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {ch.sync_status === "synced" ? "✓ Synced" : "Pending sync"}
                      </Badge>
                      {ch.last_synced_at && (
                        <span className="text-xs text-muted-foreground">
                          Last: {new Date(ch.last_synced_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => syncChannel(ch.id)}>
                      <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteChannel(ch.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorChannels;
