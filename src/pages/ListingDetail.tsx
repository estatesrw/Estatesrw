import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Maximize, Calendar } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/listings";

const ListingDetail = () => {
  const { id } = useParams();
  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    supabase.from("properties").select("*").eq("id", id!).maybeSingle()
      .then(({ data }) => { setP(data); setLoading(false); });
  }, [id]);

  const back = p?.listing_type === "sale" ? "/houses-for-sale-kigali" : "/houses-for-rent-kigali";
  const images: string[] = p?.images || [];

  return (
    <div className="min-h-screen bg-background">
      {p && (
        <Helmet>
          <title>{`${p.title} – ${p.listing_type === "sale" ? "For Sale" : "For Rent"} in ${p.city} | EstatesRW`}</title>
          <meta name="description" content={(p.description || `${p.title} in ${p.city}`).slice(0, 155)} />
        </Helmet>
      )}
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-16 max-w-5xl">
        {loading ? <p className="text-muted-foreground">Loading…</p> : !p ? (
          <p className="text-muted-foreground">This listing is no longer available. <Link to="/houses-for-sale-kigali" className="underline">Browse listings</Link></p>
        ) : (
          <>
            <Link to={back} className="text-sm text-muted-foreground underline">← All {p.listing_type === "sale" ? "houses for sale" : "houses for rent"}</Link>
            <div className="mt-4 mb-6">
              <Badge className="mb-2">{p.listing_type === "sale" ? "For Sale" : "For Rent"}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{p.title}</h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-2"><MapPin className="w-4 h-4" />{p.address}, {p.city}</p>
            </div>
            {images.length > 0 && (
              <div className="mb-8">
                <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                  <img src={images[active]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button key={img} onClick={() => setActive(i)} className={`w-24 h-16 shrink-0 rounded-md overflow-hidden border-2 ${i === active ? "border-primary" : "border-transparent"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-4 h-4" />{p.bedrooms ?? 0} bedrooms</span>
                  <span className="flex items-center gap-1"><Bath className="w-4 h-4" />{p.bathrooms ?? 0} bathrooms</span>
                  {p.area ? <span className="flex items-center gap-1"><Maximize className="w-4 h-4" />{p.area} m²</span> : null}
                </div>
                <p className="whitespace-pre-line text-foreground">{p.description}</p>
                {p.amenities?.length > 0 && (
                  <div className="flex flex-wrap gap-2">{p.amenities.map((a: string) => <Badge key={a} variant="secondary">{a}</Badge>)}</div>
                )}
              </div>
              <aside className="rounded-xl border border-border p-6 space-y-4 h-fit">
                <p className="text-2xl font-bold text-primary">{formatPrice(p.price, p.currency, p.listing_type)}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Available from {formatDate(p.available_from)}</p>
                <p className="text-sm text-muted-foreground">Listed {formatDate(p.listed_at || p.created_at)}</p>
                <Button asChild className="w-full"><Link to="/contact">Contact us about this house</Link></Button>
              </aside>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
