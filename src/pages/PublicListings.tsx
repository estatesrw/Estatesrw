import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Bed, Bath, Home } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/listings";

const copy = {
  sale: {
    title: "Houses for Sale in Kigali, Rwanda | EstatesRW",
    desc: "Browse verified houses, apartments and land for sale in Kigali and across Rwanda. Prices, photos and direct contact with EstatesRW.",
    h1: "Houses for Sale in Kigali",
    intro: "Verified homes, apartments and plots for sale in Kigali and across Rwanda — ideal for local buyers, the diaspora and foreign investors.",
    path: "/houses-for-sale-kigali",
  },
  rent: {
    title: "Houses for Rent in Kigali, Rwanda | EstatesRW",
    desc: "Find houses and apartments for rent in Kigali. Monthly prices, availability dates, photos and professional property management by EstatesRW.",
    h1: "Houses for Rent in Kigali",
    intro: "Managed homes and apartments for rent in Kigali with clear monthly prices and move-in dates.",
    path: "/houses-for-rent-kigali",
  },
};

const PublicListings = ({ type }: { type: "sale" | "rent" }) => {
  const c = copy[type];
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    supabase.from("properties").select("*").eq("status", "active").eq("listing_type", type)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false); });
  }, [type]);

  const filtered = items.filter((p) => `${p.title} ${p.city} ${p.address}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{c.title}</title>
        <meta name="description" content={c.desc} />
        <link rel="canonical" href={`https://estatesrw.lovable.app${c.path}`} />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.desc} />
      </Helmet>
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{c.h1}</h1>
        <p className="text-muted-foreground max-w-2xl mb-6">{c.intro}</p>
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to={type === "sale" ? "/houses-for-rent-kigali" : "/houses-for-sale-kigali"} className="text-sm underline text-primary">
            {type === "sale" ? "Looking to rent instead?" : "Looking to buy instead?"}
          </Link>
          <Link to="/blog" className="text-sm underline text-primary">Read our Rwanda property guides</Link>
        </div>
        <Input placeholder="Search by area or name…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm mb-8" />
        {loading ? <p className="text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
          <Card><CardContent className="p-12 text-center text-muted-foreground">No listings yet — check back soon or <Link to="/contact" className="underline">contact us</Link>.</CardContent></Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link key={p.id} to={`/listing/${p.id}`}>
                <Card className="overflow-hidden h-full hover:shadow-card-hover transition-shadow">
                  <div className="aspect-video bg-muted overflow-hidden">
                    {p.images?.[0] ? <img src={p.images[0]} alt={p.title} loading="lazy" className="w-full h-full object-cover" /> :
                      <div className="w-full h-full flex items-center justify-center"><Home className="w-10 h-10 text-muted-foreground" /></div>}
                  </div>
                  <CardContent className="p-5 space-y-2">
                    <h2 className="font-display font-semibold text-lg text-foreground">{p.title}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.address}, {p.city}</p>
                    <p className="text-xl font-bold text-primary">{formatPrice(p.price, p.currency, p.listing_type)}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms ?? 0}</span>
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms ?? 0}</span>
                      {p.available_from && <span>Available {formatDate(p.available_from)}</span>}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PublicListings;
