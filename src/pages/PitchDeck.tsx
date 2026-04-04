import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Shield, Globe, Building2, BarChart3, Users, Target,
  CheckCircle2, ArrowRight, Lightbulb, Layers, Rocket, Heart,
  MapPin, Eye, Handshake, ChevronRight, Briefcase, LineChart
} from "lucide-react";
import heroImg from "@/assets/pitch/kigali-skyline.jpg";
import advisoryImg from "@/assets/pitch/investment-advisory.jpg";
import pmsImg from "@/assets/pitch/pms-technology.jpg";
import propertyImg from "@/assets/pitch/property-network.jpg";
import networkImg from "@/assets/pitch/global-network.jpg";
import landImg from "@/assets/pitch/land-investment.jpg";

const fade = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const PitchDeck = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>EstatesRW - Investment & Property Solutions | Company Overview</title>
      <meta name="description" content="Discover how EstatesRW simplifies real estate investment and property management in Rwanda. Investment advisory, property sourcing, and technology-driven solutions." />
      <link rel="canonical" href="https://estatesrw.lovable.app/pitch" />
    </Helmet>
    <Navbar />

    {/* HERO */}
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Kigali skyline real estate" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      </div>
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
          <motion.span variants={fade} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            <Briefcase className="w-4 h-4" /> Company Overview
          </motion.span>
          <motion.h1 variants={fade} className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Your Trusted Gateway to <span className="text-primary">Real Estate Investment</span> in Rwanda
          </motion.h1>
          <motion.p variants={fade} className="text-lg text-muted-foreground mb-8 leading-relaxed">
            EstatesRW sits at the intersection of investment advisory, property sourcing, and technology — simplifying how investors enter the market and how property owners manage and monetize their assets.
          </motion.p>
          <motion.div variants={fade} className="flex flex-wrap gap-4">
            <Button size="lg" asChild><Link to="/contact">Schedule a Consultation <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/services">Explore Our Services</Link></Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* THE PROBLEM */}
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">The Challenge</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            A Fragmented Market Needs a Structured Partner
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "For Investors", icon: TrendingUp, points: ["Lack of reliable local partners", "Difficulty identifying genuine opportunities", "Limited market transparency", "Risk of overpaying due to speculation", "Complex legal and administrative processes"] },
            { title: "For Property Owners", icon: Building2, points: ["Difficulty finding consistent clients", "Poor management systems", "Lack of visibility to international markets", "No centralized operations platform"] },
            { title: "For the Market", icon: Globe, points: ["Fragmented ecosystem with no bridge", "No structured investor-opportunity connection", "Limited technology adoption in property management"] },
          ].map((card, i) => (
            <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-5">
                <card.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{card.title}</h3>
              <ul className="space-y-2.5">
                {card.points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* THE SOLUTION */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Our Solution</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            An Integrated Ecosystem Connecting All Players
          </motion.h2>
          <motion.p variants={fade} className="text-muted-foreground mt-4">
            EstatesRW provides three core solutions that work together to create a seamless real estate experience.
          </motion.p>
        </motion.div>

        {/* Solution 1 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
          className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-primary font-bold text-sm">01</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-1 mb-4">Investment Advisory</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We guide international and local investors through every step — from identifying high-potential opportunities to negotiation, due diligence, and deal structuring.
            </p>
            <ul className="space-y-3">
              {["Market analysis & insights", "Site visits & due diligence", "Negotiation & deal structuring", "Legal & admin support"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={advisoryImg} alt="Investment advisory team meeting" className="w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
          </div>
        </motion.div>

        {/* Solution 2 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
          className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden shadow-xl">
            <img src={propertyImg} alt="Curated luxury property in Kigali" className="w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
          </div>
          <div className="order-1 md:order-2">
            <span className="text-primary font-bold text-sm">02</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-1 mb-4">Property Access Network</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A curated portfolio of land, apartments, and hotels with direct access to verified and off-market opportunities across Rwanda.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Land", icon: MapPin },
                { label: "Apartments", icon: Building2 },
                { label: "Hotels", icon: Briefcase },
              ].map(t => (
                <div key={t.label} className="bg-secondary rounded-xl p-4 text-center">
                  <t.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Solution 3 */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
          className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-bold text-sm">03</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-1 mb-4">Property Management System</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A digital platform enabling property owners to manage bookings, track occupancy, handle operations, connect with service providers, and access clients — all from one dashboard.
            </p>
            <ul className="space-y-3">
              {["Manage bookings & occupancy", "Handle operations end-to-end", "Connect with service providers", "Access domestic & international clients"].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src={pmsImg} alt="Property management dashboard" className="w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
          </div>
        </motion.div>
      </div>
    </section>

    {/* BUSINESS MODEL */}
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Revenue Model</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Sustainable & Scalable Business Model
          </motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { phase: "Short-Term", icon: Rocket, items: ["Investment advisory fees", "Transaction commissions (avg 5%)"], color: "primary" },
            { phase: "Mid-Term", icon: BarChart3, items: ["Booking commissions from apartments", "Short-term rental commissions"], color: "primary" },
            { phase: "Long-Term", icon: LineChart, items: ["PMS subscriptions for owners", "Premium services & partnerships"], color: "primary" },
          ].map((phase, i) => (
            <motion.div key={phase.phase} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <phase.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4">{phase.phase} Revenue</h3>
              <ul className="space-y-3">
                {phase.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* TARGET MARKET */}
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={networkImg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Who We Serve</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">Target Market & Partners</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Primary", icon: Target, items: ["International investors (Europe, Asia, Diaspora)", "High-net-worth individuals", "Real estate developers"] },
            { title: "Secondary", icon: Users, items: ["Apartment owners", "Hotel operators", "Landowners"] },
            { title: "Strategic Partners", icon: Handshake, items: ["Real estate consultants", "Legal advisors", "Construction companies", "International investor networks"] },
          ].map((group, i) => (
            <motion.div key={group.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.15 }}
              className="bg-card/80 backdrop-blur rounded-2xl p-8 border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <group.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* UNIQUE POSITIONING */}
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Why EstatesRW</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Not a Traditional Agency — An Ecosystem Builder
          </motion.h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { icon: MapPin, label: "On-the-ground deal sourcing" },
            { icon: Layers, label: "Structured investment approach" },
            { icon: Lightbulb, label: "Technology integration (PMS)" },
            { icon: Globe, label: "Local & international network" },
            { icon: Shield, label: "End-to-end investor support" },
          ].map((d, i) => (
            <motion.div key={d.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 text-center border border-border hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <d.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">{d.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* HOW IT WORKS */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Process</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">How It Works</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Investors */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> For Investors</h3>
            <div className="space-y-4">
              {["Initial consultation", "Needs assessment", "Curated opportunity selection", "Site visits", "Investment analysis", "Negotiation", "Transaction completion"].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
          {/* Property Owners */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="bg-card rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> For Property Owners</h3>
            <div className="space-y-4">
              {["Property onboarding", "Listing and exposure", "Client acquisition support", "PMS integration", "Ongoing management"].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* GROWTH STRATEGY */}
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-14">
          <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">Roadmap</motion.span>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">Growth Strategy</motion.h2>
        </motion.div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { phase: "Phase 1", title: "Foundation", items: ["Build brand authority", "Generate investor pipeline", "Close initial deals"] },
            { phase: "Phase 2", title: "Expansion", items: ["Expand property network", "Increase deal flow", "Strengthen partnerships"] },
            { phase: "Phase 3", title: "Scale", items: ["Launch PMS platform", "Onboard property owners", "Introduce subscriptions"] },
            { phase: "Phase 4", title: "Ecosystem", items: ["Full ecosystem connection", "Regional expansion", "Connect investors & services"] },
          ].map((p, i) => (
            <motion.div key={p.phase} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.12 }}
              className="relative bg-card rounded-2xl p-6 border border-border">
              <span className="text-xs font-bold text-primary uppercase">{p.phase}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-4">{p.title}</h3>
              <ul className="space-y-2">
                {p.items.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* TRACTION */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Traction</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Current Progress</h2>
            <ul className="space-y-4">
              {[
                "Active engagement with international investors",
                "Multiple site visits conducted across Kigali",
                "Growing portfolio of land and apartment opportunities",
                "Strategic partnerships including international investor channels",
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="rounded-2xl overflow-hidden shadow-xl">
            <img src={landImg} alt="Land investment opportunity in Rwanda" className="w-full h-80 object-cover" loading="lazy" width={1280} height={720} />
          </motion.div>
        </div>
      </div>
    </section>

    {/* VISION MISSION VALUES */}
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="bg-card rounded-2xl p-8 border border-border text-center">
            <Eye className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To become the leading platform for real estate investment and property management in Rwanda and beyond.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-8 border border-border text-center">
            <Target className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To simplify real estate investment, provide structured and secure opportunities, empower property owners with tools and visibility, and build a connected ecosystem.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} transition={{ delay: 0.2 }} className="bg-card rounded-2xl p-8 border border-border text-center">
            <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-3">Core Values</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Trust & Transparency", "Professionalism", "Market Knowledge", "Efficiency", "Long-term Partnerships"].map(v => (
                <span key={v} className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">{v}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* WHAT WE'RE BUILDING + CTA */}
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            We're Building More Than a Service
          </motion.h2>
          <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Rocket, label: "A Deal Flow Engine" },
              { icon: Globe, label: "A Property Network" },
              { icon: Lightbulb, label: "A Technology Platform" },
              { icon: Shield, label: "A Trusted Brand" },
            ].map(b => (
              <div key={b.label} className="bg-card rounded-xl p-5 border border-border">
                <b.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">{b.label}</p>
              </div>
            ))}
          </motion.div>
          <motion.p variants={fade} className="text-muted-foreground mb-8 leading-relaxed">
            EstatesRW combines real-world deal execution, strong local expertise, international investor access, and technology-driven solutions — creating a scalable model capable of transforming real estate investment and property management in Rwanda.
          </motion.p>
          <motion.div variants={fade} className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild><Link to="/contact">Get Started Today <ArrowRight className="ml-2 w-4 h-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/dashboard/browse">Browse Properties</Link></Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PitchDeck;
