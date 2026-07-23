import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  const benefits = [
    "Free to list your first property",
    "Verified tenants & landlords",
    "Secure payment processing",
    "24/7 customer support",
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative max-w-5xl mx-auto rounded-[32px] bg-primary text-primary-foreground overflow-hidden shadow-elevated">
          {/* Ambient glows */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />

          <div className="relative z-10 px-6 py-16 md:px-16 md:py-20 text-center">
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight mb-6">
              Ready to Find Your
              <br />
              <span className="italic font-medium text-accent">Perfect Property?</span>
            </h2>
            <p className="text-primary-foreground/80 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of happy users who found their dream homes or grew their property portfolios with EstatesRW.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {benefits.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/10 backdrop-blur-sm rounded-full px-3.5 py-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-accent" />
                  <span className="text-primary-foreground/90 text-xs md:text-sm font-medium">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-7 bg-background text-foreground hover:bg-background/90"
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
                className="rounded-full h-12 px-7 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/auth">List your property</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
