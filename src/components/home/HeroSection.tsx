import { ArrowRight, ShieldCheck, Building2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { trackCTAClick } from "@/lib/analytics";

const HeroSection = () => {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden bg-background">
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
              EstatesRW
            </span>
            <span className="text-xs md:text-sm font-medium text-foreground/80">
              Rwanda's trusted property management & investment partner
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl md:text-7xl lg:text-[80px] leading-[1.02] tracking-tight text-foreground mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            Professional Property
            <br />
            <span className="italic font-medium text-primary">Management</span>{" "}
            <span className="italic font-medium">Made Simple</span>
          </h1>

          <p
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed"
            style={{ animationDelay: "0.1s" }}
          >
            We manage, market, and grow your real estate assets in Rwanda — from investment advisory and property sourcing to full-service operations powered by our end-to-end management platform.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full h-12 px-7 bg-foreground text-background hover:bg-foreground/90 shadow-elevated"
            >
              <Link to="/contact">
                Schedule a consultation
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full h-12 px-7 border-foreground/15 bg-card hover:bg-secondary"
            >
              <Link to="/services">Explore our services</Link>
            </Button>
          </div>

          {/* Trust strip */}
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            {[
              { icon: ShieldCheck, title: "End-to-end support", desc: "From sourcing to operations" },
              { icon: Building2, title: "Full-service PMS", desc: "Bookings, occupancy & payouts" },
              { icon: Globe2, title: "Global investor network", desc: "Diaspora & international reach" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
