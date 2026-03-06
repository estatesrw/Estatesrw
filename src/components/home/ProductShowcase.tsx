import { BarChart3, CalendarCheck, Building2, Shield, Users, DollarSign } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Admin Dashboard",
    description: "Complete platform control with real-time analytics, user management, and financial oversight.",
  },
  {
    icon: Building2,
    title: "Vendor PMS",
    description: "Manage properties, rooms, pricing, and availability with a simplified property management system.",
  },
  {
    icon: CalendarCheck,
    title: "Booking Calendar",
    description: "Color-coded availability calendar with real-time booking status, check-ins, and check-outs.",
  },
  {
    icon: Shield,
    title: "Payment Gatekeeper",
    description: "Admin-controlled payment verification ensures every booking is confirmed before vendor payout.",
  },
  {
    icon: Users,
    title: "Guest Management",
    description: "Track guest history, manage reviews, and maintain communication throughout the booking lifecycle.",
  },
  {
    icon: DollarSign,
    title: "Commission Engine",
    description: "Automated commission calculation with per-vendor rates, payout tracking, and financial reports.",
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Platform Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Built For Professional Property Management
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete multi-vendor booking and property management platform with
            admin-controlled payment verification and automated commission tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="relative bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Mockup Preview */}
        <div className="mt-16 relative">
          <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
            <div className="bg-primary px-6 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              </div>
              <span className="text-xs text-primary-foreground/60 ml-2 font-medium">EstatesRW — Admin Dashboard</span>
            </div>
            <div className="p-6 bg-background">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Properties", value: "1,247", color: "bg-primary/10 text-primary" },
                  { label: "Active Bookings", value: "384", color: "bg-success/10 text-success" },
                  { label: "Pending Approval", value: "23", color: "bg-warning/10 text-warning" },
                  { label: "Monthly Revenue", value: "$48,920", color: "bg-primary/10 text-primary" },
                ].map(s => (
                  <div key={s.label} className="p-4 rounded-xl bg-card border border-border shadow-soft">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground mt-1 font-sans">{s.value}</p>
                    <div className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${s.color}`}>Live</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
                ))}
                {Array.from({ length: 28 }).map((_, i) => {
                  const statuses = ["bg-success/20 border-success/30", "bg-destructive/20 border-destructive/30", "bg-warning/20 border-warning/30", "bg-success/20 border-success/30"];
                  return (
                    <div key={i} className={`aspect-square rounded-md border flex items-center justify-center text-[10px] font-medium text-muted-foreground ${statuses[i % 4]}`}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;