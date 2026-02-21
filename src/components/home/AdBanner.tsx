import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdBanner = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("advertisements")
      .select("*")
      .eq("status", "active")
      .order("display_order")
      .then(({ data }) => setAds(data || []));
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;
    const interval = setInterval(() => setCurrent((c) => (c + 1) % ads.length), 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <section className="py-6 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sponsored</span>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
            <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow aspect-[3/1] relative">
              {ad.video_url ? (
                <video src={ad.video_url} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              ) : ad.image_url ? (
                <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-primary-foreground font-display text-2xl font-bold">{ad.title}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
                <p className="text-primary-foreground text-sm font-medium">{ad.title}</p>
              </div>
            </div>
          </a>
          {ads.length > 1 && (
            <>
              <button
                onClick={() => setCurrent((c) => (c - 1 + ads.length) % ads.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrent((c) => (c + 1) % ads.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:bg-card transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex justify-center gap-2 mt-3">
                {ads.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdBanner;
