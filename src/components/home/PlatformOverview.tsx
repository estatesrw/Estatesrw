import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Lightbulb, ArrowRight, Globe, Shield, Users } from "lucide-react";

const PlatformOverview = () => (
  <section className="py-16 md:py-20 bg-secondary">
    <div className="container mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mb-10 md:mb-12"
      >
        <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">
          More Than a Marketplace
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2">
          Your Complete Real Estate Ecosystem
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-3 md:mt-4 px-2">
          EstatesRW isn't just about finding properties — we're building the infrastructure for smarter real estate investment, management, and growth in Rwanda.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-10">
        {[
          {
            icon: TrendingUp,
            title: "Investment Advisory",
            desc: "Expert guidance for international and local investors — from market analysis and site visits to negotiation and deal completion.",
          },
          {
            icon: Building2,
            title: "Property Management",
            desc: "A full-featured digital platform for owners to manage bookings, track occupancy, handle operations, and reach global clients.",
          },
          {
            icon: Globe,
            title: "Property Access Network",
            desc: "Curated portfolio of land, apartments, and hotels — including verified off-market deals you won't find anywhere else.",
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:shadow-lg transition-shadow group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-5 group-hover:bg-primary transition-colors">
              <card.icon className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-base md:text-lg font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
        {[
          { icon: Shield, value: "End-to-End", label: "Investor Support" },
          { icon: Users, value: "International", label: "Network Access" },
          { icon: Lightbulb, value: "Tech-Driven", label: "PMS Platform" },
          { icon: TrendingUp, value: "5%", label: "Avg Commission" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="bg-card rounded-xl p-4 md:p-5 border border-border text-center"
          >
            <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-2" />
            <p className="text-base md:text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <Button asChild size="lg">
          <Link to="/pitch">
            Learn More About What We Do <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default PlatformOverview;
