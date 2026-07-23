import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Building2, MapPin, Briefcase, Layers } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const WhatWeDo = () => (
  <section className="py-20 md:py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fade}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
        <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">
          What We Do
        </span>
        <h2 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-tight text-foreground mt-3">
          Your <span className="italic font-medium text-primary">trusted gateway</span> to real estate in Rwanda
        </h2>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          EstatesRW sits at the intersection of investment advisory, property sourcing, and property management technology —
          simplifying how investors enter the market and how owners operate and monetize their assets.
        </p>
      </motion.div>

      {/* Three pillars */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          {
            n: "01",
            icon: TrendingUp,
            title: "Investment Advisory",
            desc: "We guide local and international investors through every step — from identifying high-potential opportunities to negotiation, due diligence, and deal structuring.",
            items: ["Market analysis & insights", "Site visits & due diligence", "Negotiation & deal structuring", "Legal & admin support"],
          },
          {
            n: "02",
            icon: MapPin,
            title: "Property Access Network",
            desc: "A curated portfolio of land, apartments, and hotels with direct access to verified and off-market opportunities across Rwanda.",
            items: ["Verified land parcels", "Prime apartments", "Hotels & lodges", "Off-market deals"],
          },
          {
            n: "03",
            icon: Building2,
            title: "Property Management System",
            desc: "A digital platform enabling owners to manage bookings, track occupancy, handle operations, and reach domestic and international clients — from one dashboard.",
            items: ["Bookings & occupancy", "Operations end-to-end", "Service provider network", "Global client access"],
          },
        ].map((p, i) => (
          <motion.div
            key={p.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ duration: 0.45, delay: i * 0.1 }}
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
          </motion.div>
        ))}
      </div>

      {/* Positioning strip */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fade}
        transition={{ duration: 0.5 }}
        className="rounded-3xl border border-border bg-secondary p-8 md:p-10"
      >
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="font-display text-2xl md:text-3xl tracking-tight text-foreground">
            Not a traditional agency — an <span className="italic font-medium text-primary">ecosystem builder</span>
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: MapPin, label: "On-the-ground deal sourcing" },
            { icon: Layers, label: "Structured investment approach" },
            { icon: Building2, label: "Technology-driven PMS" },
            { icon: Briefcase, label: "Local & international network" },
            { icon: CheckCircle2, label: "End-to-end investor support" },
          ].map((d) => (
            <div key={d.label} className="bg-card rounded-2xl p-4 text-center border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <d.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs md:text-sm font-semibold text-foreground leading-snug">{d.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default WhatWeDo;
