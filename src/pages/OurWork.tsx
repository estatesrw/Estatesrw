import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { trackCTAClick } from "@/lib/analytics";
import {
  Download, FileText, ArrowRight, CheckCircle2, TrendingUp, MapPin, Building2,
  Hotel, Users, Briefcase, Home, Wrench, Scale, ClipboardCheck, ShieldCheck,
} from "lucide-react";

import profilePdf from "@/assets/EstatesRW-Company-Profile.pdf.asset.json";
const PDF_PATH = profilePdf.url;

const pillars = [
  {
    n: "01",
    icon: TrendingUp,
    title: "Investment Advisory",
    desc: "We guide local and international investors from opportunity identification through negotiation, due diligence and deal structuring.",
    items: ["Market analysis & insights", "Site visits & due diligence", "Negotiation & deal structuring", "Legal & admin support"],
  },
  {
    n: "02",
    icon: MapPin,
    title: "Property Access Network",
    desc: "A curated portfolio of land, apartments and hotels, with direct access to verified and off-market opportunities across Rwanda.",
    items: ["Verified land parcels", "Prime apartments", "Hotels & lodges", "Off-market deals"],
  },
  {
    n: "03",
    icon: Building2,
    title: "Property Management System",
    desc: "Our own operating system for properties, units, leases, rent, contracts and people — all in one dashboard.",
    items: ["Bookings & occupancy", "End-to-end operations", "Service provider network", "Global client access"],
  },
];

const services = [
  { icon: Home, title: "Property Management", desc: "Tenant screening, rent collection, lease administration and regular inspections." },
  { icon: Hotel, title: "Hospitality Operations", desc: "Guest communication, check-ins, housekeeping and daily operations for hotels, lodges and serviced apartments." },
  { icon: Briefcase, title: "Real Estate Consultancy", desc: "Investment advisory, market reports, valuation and portfolio strategy for Rwanda's market." },
  { icon: TrendingUp, title: "Revenue Optimisation", desc: "Dynamic pricing, channel management and direct-booking strategies that lift occupancy and income." },
  { icon: ClipboardCheck, title: "Project Management", desc: "Full lifecycle delivery — planning, contractor coordination, risk management and progress reporting." },
  { icon: Wrench, title: "Maintenance Network", desc: "A vetted network of cleaners, technicians and suppliers keeping every property guest-ready." },
  { icon: Scale, title: "Legal & Compliance", desc: "Title transfers, contract drafting, dispute resolution and regulatory guidance." },
  { icon: ShieldCheck, title: "Secure Payments & Reporting", desc: "Transparent payment tracking with detailed statements and owner dashboards." },
];

const audiences = [
  { title: "Property Owners & Landlords", desc: "Single-unit owners and portfolio holders who want reliable income and full visibility without daily involvement." },
  { title: "Hoteliers & Hospitality Operators", desc: "Hotels, lodges, guesthouses and serviced apartments needing professional operations and consistent guest standards." },
  { title: "Investors — Local & Diaspora", desc: "Rwandans abroad and international investors acquiring, developing or repositioning assets, supported end to end." },
  { title: "Tenants & Guests", desc: "Long-stay tenants and short-stay guests with verified listings, clear contracts and digital payments." },
  { title: "Agents & Service Providers", desc: "Referral agents earning commission, plus cleaners, technicians, designers and suppliers in our service network." },
];

const deckContents = [
  "Who we are, our story and our mission",
  "Our three pillars: advisory, property access, management technology",
  "The full list of services we offer",
  "Who we work with — owners, hoteliers, investors, tenants and partners",
  "Inside the EstatesRW property management platform",
  "Leadership and contact details",
];

const stats = [
  { value: "500+", label: "Properties managed" },
  { value: "98%", label: "Client satisfaction" },
  { value: "50+", label: "Expert consultants" },
  { value: "10+", label: "Years of experience" },
];

const OurWork = () => {
  const handleDownload = () => trackCTAClick("Download Company Profile", "our-work", PDF_PATH);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Our Work - Company Profile & Services | EstatesRW</title>
        <meta
          name="description"
          content="See what EstatesRW does, the services we offer and who we work with across Rwanda — and download our company profile PDF to share with partners and investors."
        />
        <link rel="canonical" href="https://estatesrw.lovable.app/our-work" />
        <meta property="og:title" content="Our Work - Company Profile & Services | EstatesRW" />
        <meta property="og:description" content="Investment advisory, property access and a purpose-built property management system in Rwanda. Download the EstatesRW company profile." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary-foreground)/0.08),transparent_55%)]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="text-accent font-semibold text-xs uppercase tracking-[0.2em]">
                Our Work
              </span>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight text-primary-foreground mt-4">
                What we do, who we do it{" "}
                <span className="italic font-medium text-accent">with</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg mt-6 leading-relaxed max-w-2xl">
                EstatesRW combines investment advisory, direct property access and a purpose-built
                management system — one partner for owners, hoteliers, investors and guests in Rwanda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-7"
                  asChild
                  onClick={handleDownload}
                >
                  <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" download="EstatesRW-Company-Profile.pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Download company profile
                  </a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-7 border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/contact">
                    Talk to our team
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-5">
                  <p className="font-display text-2xl md:text-3xl text-accent">{s.value}</p>
                  <p className="text-primary-foreground/70 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Download card */}
        <section className="py-16 md:py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-soft">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                  <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
                    Company Profile
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl tracking-tight text-foreground mt-3">
                    A pitch deck you can{" "}
                    <span className="italic font-medium text-primary">send anywhere</span>
                  </h2>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    One PDF covering our profile, our services, who we work with and the technology
                    behind our management — ready to share with partners, investors and property owners.
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {deckContents.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="rounded-full px-7 mt-8" asChild onClick={handleDownload}>
                    <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" download="EstatesRW-Company-Profile.pdf">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>

                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="EstatesRW-Company-Profile.pdf"
                  onClick={handleDownload}
                  className="group rounded-3xl bg-primary p-10 md:p-14 flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-1"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-5">
                    <FileText className="w-8 h-8 text-accent" />
                  </div>
                  <p className="font-display text-2xl text-primary-foreground">
                    EstatesRW Company Profile
                  </p>
                  <p className="text-primary-foreground/60 text-sm mt-2">
                    PDF · 7 pages · Updated 2026
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-accent text-sm font-semibold">
                    Download now
                    <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
                Our Model
              </span>
              <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-foreground mt-3">
                Three pillars, one{" "}
                <span className="italic font-medium text-primary">ecosystem</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-3xl border border-border bg-card p-7 md:p-8 shadow-soft hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <p.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground/70">{p.n}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2">
                    {p.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
                Capabilities
              </span>
              <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-foreground mt-3">
                Services we offer
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s) => (
                <div key={s.title} className="rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="outline" size="lg" className="rounded-full px-7" asChild>
                <Link to="/services">
                  See full service details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Who we work with */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12">
              <div>
                <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">
                  Clients & Partners
                </span>
                <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-foreground mt-3">
                  Who we work{" "}
                  <span className="italic font-medium text-primary">with</span>
                </h2>
                <p className="text-muted-foreground mt-5 leading-relaxed">
                  Everything we build is shaped around five groups of people, each with their own
                  tools and workflows inside the EstatesRW system.
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Owners · Hoteliers · Investors · Tenants · Partners
                </div>
              </div>

              <div className="space-y-4">
                {audiences.map((a, i) => (
                  <div key={a.title} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start gap-4">
                      <span className="font-display text-primary/40 text-lg shrink-0">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground">{a.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{a.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 md:py-24 bg-primary">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl tracking-tight text-primary-foreground leading-[1.05]">
              Partner with EstatesRW
            </h2>
            <p className="text-primary-foreground/75 mt-5 leading-relaxed">
              Whether you own a single apartment, operate a hotel, or want to invest in Rwandan real
              estate from abroad — we would love to talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-9">
              <Button size="lg" variant="secondary" className="rounded-full px-7" asChild onClick={handleDownload}>
                <a href={PDF_PATH} target="_blank" rel="noopener noreferrer" download="EstatesRW-Company-Profile.pdf">
                  <Download className="w-4 h-4 mr-2" />
                  Download company profile
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-7 border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/contact">Contact us</Link>
              </Button>
            </div>
            <p className="text-primary-foreground/50 text-sm mt-8">
              info@estatesrw.com · +250 791 915 459 · Kigali, Rwanda
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurWork;
