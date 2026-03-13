import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Building2, ClipboardCheck, HardHat, Briefcase, Scale, 
  TrendingUp, ShieldCheck, Paintbrush, TreeDeciduous, Truck,
  ArrowRight, CheckCircle2, Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const coreServices = [
  {
    icon: Building2,
    title: "Property Management",
    description: "End-to-end property management including tenant screening, rent collection, lease administration, and regular property inspections.",
    features: ["Tenant Screening & Placement", "Rent Collection & Accounting", "Lease Management", "Regular Property Inspections"],
  },
  {
    icon: Briefcase,
    title: "Real Estate Consultancy",
    description: "Expert guidance on property investments, market analysis, valuations, and strategic portfolio planning tailored to Rwanda's dynamic market.",
    features: ["Investment Advisory", "Market Analysis & Reports", "Property Valuation", "Portfolio Strategy"],
  },
  {
    icon: HardHat,
    title: "Construction Supervision",
    description: "On-site project supervision ensuring quality standards, timeline adherence, budget control, and regulatory compliance for your builds.",
    features: ["Quality Assurance", "Timeline Management", "Budget Monitoring", "Compliance Oversight"],
  },
  {
    icon: ClipboardCheck,
    title: "Project Management",
    description: "Full lifecycle project management from concept to completion, coordinating architects, contractors, and stakeholders seamlessly.",
    features: ["Planning & Scheduling", "Contractor Coordination", "Risk Management", "Progress Reporting"],
  },
  {
    icon: Scale,
    title: "Legal & Compliance",
    description: "Navigate Rwanda's property laws with confidence. We handle title transfers, contract drafting, dispute resolution, and regulatory compliance.",
    features: ["Title Transfers", "Contract Drafting", "Dispute Resolution", "Regulatory Guidance"],
  },
  {
    icon: TrendingUp,
    title: "Property Valuation",
    description: "Accurate, data-driven property valuations for buying, selling, insurance, or investment purposes across all property types in Rwanda.",
    features: ["Market Comparisons", "Income Approach", "Insurance Valuations", "Investment Analysis"],
  },
];

const additionalServices = [
  { icon: ShieldCheck, title: "Security Installation", desc: "CCTV, access control, and 24/7 monitoring systems for residential and commercial properties." },
  { icon: Paintbrush, title: "Interior Design", desc: "Transform spaces with professional interior design, staging, and renovation services." },
  { icon: TreeDeciduous, title: "Landscaping", desc: "Garden design, lawn maintenance, and outdoor living space creation." },
  { icon: Truck, title: "Moving & Relocation", desc: "Reliable packing, transport, and setup services for stress-free moves." },
];

const stats = [
  { value: "500+", label: "Properties Managed" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "50+", label: "Expert Consultants" },
  { value: "10+", label: "Years Experience" },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Our Services - Property Management & Consultancy | EstatesRW</title>
        <meta name="description" content="Professional property management, real estate consultancy, construction supervision, and more. EstatesRW offers comprehensive real estate services across Rwanda." />
        <link rel="canonical" href="https://estatesrw.lovable.app/services" />
      </Helmet>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.8),transparent_60%),radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.3),transparent_50%)]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm border border-white/10">
                Professional Real Estate Services
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Your Property, <br />
                <span className="text-accent">Our Expertise</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                From management to consultancy, supervision to valuation — we provide comprehensive real estate services that protect and grow your investment in Rwanda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-base px-8" onClick={() => navigate("/contact")}>
                  Get a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-8 border-white/20 text-primary-foreground hover:bg-white/10" onClick={() => document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Services
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-primary-foreground/70 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Services Grid */}
        <section id="services-grid" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Do</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Core Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive real estate solutions designed to maximize your property's potential and protect your investment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreServices.map((service, i) => (
                <div
                  key={service.title}
                  className="group relative bg-card rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/30 overflow-hidden"
                >
                  {/* Subtle gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <service.icon className="w-7 h-7" />
                    </div>

                    <h3 className="font-display font-bold text-lg text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                      {service.description}
                    </p>

                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Simple Process, Exceptional Results
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: "01", title: "Consultation", desc: "Tell us about your property goals and challenges." },
                { step: "02", title: "Assessment", desc: "Our experts evaluate your property and market position." },
                { step: "03", title: "Custom Plan", desc: "We create a tailored strategy for your specific needs." },
                { step: "04", title: "Execution", desc: "We implement, monitor, and optimize continuously." },
              ].map((item, i) => (
                <div key={item.step} className="text-center relative">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-primary/5" />
                  )}
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">More Services</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Additional Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {additionalServices.map((service) => (
                <div key={service.title} className="bg-card rounded-2xl p-6 shadow-card border border-border hover:border-primary/20 hover:shadow-card-hover transition-all text-center group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20.5h2V0h2v20.5h2V0h2v20.5h2V0h2v20.5h2V0h2v22H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
              Let our experts help you make the most of your property investment. Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base px-8" onClick={() => navigate("/contact")}>
                <Phone className="w-5 h-5 mr-2" />
                Contact Us Today
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 border-white/20 text-primary-foreground hover:bg-white/10" onClick={() => navigate("/auth")}>
                Create an Account
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
