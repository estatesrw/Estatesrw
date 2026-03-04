import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Heart, MapPin, BedDouble, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SavedPropertiesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("saved_properties")
        .select("*, properties(id, title, city, address, price, bedrooms, bathrooms, images, property_type, status)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setSaved(data || []);
    };
    fetch();
  }, [user]);

  const unsave = async (id: string) => {
    await supabase.from("saved_properties").delete().eq("id", id);
    setSaved(prev => prev.filter(s => s.id !== id));
    toast({ title: "Property removed from saved" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Saved Properties</h2>
        <p className="text-muted-foreground">Properties you've bookmarked for later</p>
      </div>

      {saved.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 text-primary/30" />
            No saved properties yet. Browse properties and save your favorites!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {saved.map((s) => {
            const p = s.properties;
            if (!p) return null;
            const img = p.images?.[0] || "/placeholder.svg";
            return (
              <Card key={s.id} className="shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
                <div className="aspect-video overflow-hidden relative">
                  <img src={img} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  <button onClick={() => unsave(s.id)} className="absolute top-2 right-2 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-destructive/10 transition-colors">
                    <Heart className="w-4 h-4 fill-destructive text-destructive" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />{p.city}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    {p.bedrooms > 0 && <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>}
                    {p.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <p className="font-bold text-foreground">RWF {Number(p.price).toLocaleString()}</p>
                    <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/property/${p.id}`)}>View</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedPropertiesPage;
