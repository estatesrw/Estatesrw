import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Image, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdsManagementPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "", image_url: "", video_url: "", link_url: "", status: "active", display_order: "0",
  });

  const fetchAds = async () => {
    const { data } = await supabase.from("advertisements").select("*").order("display_order");
    setAds(data || []);
  };

  useEffect(() => { fetchAds(); }, []);

  const resetForm = () => {
    setForm({ title: "", image_url: "", video_url: "", link_url: "", status: "active", display_order: "0" });
    setEditingId(null);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `ads/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); }
    else {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      const isVideo = file.type.startsWith("video/");
      setForm((f) => isVideo ? { ...f, video_url: data.publicUrl } : { ...f, image_url: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, display_order: Number(form.display_order) };
    const { error } = editingId
      ? await supabase.from("advertisements").update(payload).eq("id", editingId)
      : await supabase.from("advertisements").insert(payload);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editingId ? "Ad updated" : "Ad created" }); setDialogOpen(false); resetForm(); fetchAds(); }
  };

  const handleEdit = (a: any) => {
    setForm({ title: a.title, image_url: a.image_url || "", video_url: a.video_url || "", link_url: a.link_url, status: a.status, display_order: String(a.display_order) });
    setEditingId(a.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("advertisements").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Ad deleted" }); fetchAds(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Advertisements</h2>
          <p className="text-muted-foreground">Manage homepage advertisement banners</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />New Ad</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editingId ? "Edit Ad" : "New Advertisement"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input type="url" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <Label>Media (Image or Video)</Label>
                {form.image_url && <img src={form.image_url} alt="Ad" className="w-full aspect-[3/1] object-cover rounded-lg border border-border" />}
                {form.video_url && <video src={form.video_url} controls className="w-full aspect-[3/1] object-cover rounded-lg border border-border" />}
                <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
                <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Image className="w-4 h-4 mr-2" />}
                  {uploading ? "Uploading..." : "Upload Media"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
                </div>
              </div>
              <Button type="submit" className="w-full">{editingId ? "Update" : "Create"} Ad</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {ads.length === 0 ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center text-muted-foreground">No advertisements yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {ads.map((a) => (
            <Card key={a.id} className="shadow-card">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {a.image_url && <img src={a.image_url} alt="" className="w-20 h-12 rounded object-cover shrink-0" />}
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground truncate">{a.title}</h3>
                    <a href={a.link_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" />{a.link_url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{a.status}</span>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(a)}><Pencil className="w-3 h-3" /></Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(a.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsManagementPage;
