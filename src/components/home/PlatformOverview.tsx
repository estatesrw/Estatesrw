import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Building2, Lightbulb, ArrowRight, Globe, Shield, Users } from "lucide-react";

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const PlatformOverview = () => (
  <section className="py-20 bg-secondary">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center max-w-3xl mx-auto mb-12">
        <motion.span variants={fade} className="text-primary font-semibold text-sm uppercase tracking-wider">
          More Than a Marketplace
        </motion.span>
        <motion.h2 variants={fade} className="text-3xl md:text-4xl font-bold text-foreground mt-2">
          Your Complete Real Estate Ecosystem
        </motion.h2>
        <motion.p variants={fade} className="text-muted-foreground mt-4">
          EstatesRW isn't just about finding properties — we're building the infrastructure for smarter real estate investment, management, and growth in Rwanda.
        </motion.p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-10">
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fade}
            transition={{ delay: i * 0.12 }}
            className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
              <card.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Shield, value: "End-to-End", label: "Investor Support" },
          { icon: Users, value: "International", label: "Network Access" },
          { icon: Lightbulb, value: "Tech-Driven", label: "PMS Platform" },
          { icon: TrendingUp, value: "5%", label: "Avg Commission" },
        ].map((stat) => (
          <motion.div key={stat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="bg-card rounded-xl p-5 border border-border text-center">
            <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade} className="text-center">
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
