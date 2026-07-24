import { Shield, Award, Clock, Globe } from "lucide-react";
import CountUp from "./CountUp";

const stats = [
  { icon: Shield, numeric: 100, suffix: "%", label: "Verified Vendors", desc: "Every property is verified" },
  { icon: Award, numeric: 4.8, suffix: "/5", decimals: 1, label: "Average Rating", desc: "From 3,200+ reviews" },
  { icon: Clock, prefix: "<", numeric: 2, suffix: "hrs", label: "Booking Confirmation", desc: "Fast admin approval" },
  { icon: Globe, numeric: 5, suffix: "+", label: "Cities Covered", desc: "Across Rwanda" },
];

const TrustedBySection = () => (
  <section className="py-10 md:py-12 bg-secondary">
    <div className="container mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <span className="text-primary font-semibold text-xs uppercase tracking-wider">Why EstatesRW</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1">
          Trusted by Property Professionals
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center group">
            <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <s.icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-foreground font-sans">
              <CountUp
                end={s.numeric}
                decimals={s.decimals}
                prefix={s.prefix}
                suffix={s.suffix}
              />
            </p>
            <p className="font-semibold text-sm text-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
