import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden bg-background">
      {/* Subtle line pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, hsl(0 0% 0% / 0.9), transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 40%, hsl(0 0% 0% / 0.9), transparent 70%)",
        }}
      />
      {/* Ambient glow */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-64 h-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow chip */}
          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full pl-1.5 pr-4 py-1.5 mb-8 shadow-soft animate-fade-up">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2.5 py-1">
              New
            </span>
            <span className="text-xs md:text-sm font-medium text-foreground/80">
              Rwanda's #1 property platform — verified & secure
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-[80px] leading-[1.02] tracking-tight text-foreground mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            Find Your Perfect
            <br />
            <span className="italic font-medium text-primary">Place to Call</span>{" "}
            <span className="italic font-medium">Home</span>
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            Discover properties for sale and rent across Rwanda. Connect with
            landlords, tenants, and professional services all in one platform.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full h-12 px-7 bg-foreground text-background hover:bg-foreground/90 shadow-elevated"
            >
              <Link to="/auth">
                Get started free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 border-foreground/15 bg-card hover:bg-secondary"
            >
              <Link to="/dashboard/browse">Browse properties</Link>
            </Button>
          </div>

          {/* Rating strip */}
          <div
            className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="font-semibold text-foreground">4.8/5</span>
            <span className="text-muted-foreground">
              from 3,200+ verified tenants & landlords
            </span>
          </div>
        </div>

        {/* Product preview mock */}
        <div
          className="mt-16 md:mt-20 max-w-5xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <div className="relative rounded-3xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/50">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              </div>
              <span className="text-xs text-muted-foreground ml-2 font-medium">
                estatesrw.com — Browse properties
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 md:p-8 bg-background">
              {[
                {
                  title: "Modern Villa",
                  loc: "Nyarutarama",
                  price: "$450,000",
                  img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
                },
                {
                  title: "Downtown Apartment",
                  loc: "Kiyovu",
                  price: "$1,500/mo",
                  img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
                },
                {
                  title: "Family Home",
                  loc: "Kimihurura",
                  price: "$280,000",
                  img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
                },
              ].map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl overflow-hidden border border-border bg-card shadow-soft"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.loc}, Kigali</p>
                    <p className="mt-2 text-base font-bold text-primary font-sans">
                      {p.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
