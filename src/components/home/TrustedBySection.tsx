import { Shield, Award, Clock, Globe } from "lucide-react";

const stats = [
  { icon: Shield, value: "100%", label: "Verified Vendors", desc: "Every property is verified" },
  { icon: Award, value: "4.8/5", label: "Average Rating", desc: "From 3,200+ reviews" },
  { icon: Clock, value: "<2hrs", label: "Booking Confirmation", desc: "Fast admin approval" },
  { icon: Globe, value: "5+", label: "Cities Covered", desc: "Across Rwanda" },
];

const TrustedBySection = () => (
  <section className="py-16 bg-secondary">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why EstatesRW</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          Trusted by Property Professionals
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <s.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <p className="text-3xl font-bold text-foreground font-sans">{s.value}</p>
            <p className="font-semibold text-sm text-foreground mt-1">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBySection;
