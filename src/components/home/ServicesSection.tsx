import { Wrench, Sparkles, TreeDeciduous, Shield, Building, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Building,
    title: "Property Management",
    description: "Full-service management including tenant screening, rent collection, and maintenance coordination.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    title: "Cleaning Services",
    description: "Professional cleaning for move-in/move-out, regular housekeeping, and deep cleaning.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Wrench,
    title: "Repairs & Maintenance",
    description: "Expert technicians for plumbing, electrical, HVAC, and general repairs on-demand.",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: TreeDeciduous,
    title: "Landscaping",
    description: "Garden design, lawn care, and outdoor maintenance to enhance property value.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Security Services",
    description: "Professional security guards, CCTV installation, and 24/7 monitoring systems.",
    color: "bg-foreground/10 text-foreground",
  },
  {
    icon: Truck,
    title: "Moving Services",
    description: "Reliable moving and relocation services with packing, transport, and unpacking.",
    color: "bg-accent/10 text-accent",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Services Marketplace
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Everything You Need, One Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with verified service providers for all your property needs. Book with confidence and pay securely.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all cursor-pointer border border-transparent hover:border-primary/20"
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-7 h-7" />
              </div>

              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all">
                Learn More
                <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg">
            Become a Service Provider
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
