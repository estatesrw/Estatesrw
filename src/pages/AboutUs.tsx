import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Hotel, Key, Sparkles, Heart, Globe, Users, Shield, Award } from "lucide-react";
import founderFiston from "@/assets/founder-fiston.png";
import founderJoshua from "@/assets/founder-joshua.png";


const AboutUs = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>About EstatesRW - Hospitality-Focused Property Management in Rwanda</title>
      <meta name="description" content="EstatesRW is Rwanda's trusted property management partner, combining hospitality expertise with technology to manage apartments, hotels, lodges, and rental homes for owners and guests." />
      <link rel="canonical" href="https://estatesrw.lovable.app/about-us" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6">
        Rwanda's Hospitality-Focused Property Management Partner
      </h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg leading-relaxed text-foreground/80">
          EstatesRW is a full-service property management company built for Rwanda's growing hospitality and rental market. We combine hands-on hospitality experience with purpose-built technology to help property owners, hoteliers, landlords, and investors turn real estate into reliable, well-run income — while delivering guests and tenants a seamless, professional experience from first inquiry to checkout.
        </p>

        <h2 className="font-display text-2xl text-foreground">Our Story</h2>
        <p className="text-foreground/70">
          EstatesRW was created from a deep love for Rwanda and a vision to connect it with the world. With honesty, transparency, and trust at our core, we help people find the right home, land, or business that truly fits their goals. Our mission is to make real estate in Rwanda simple, accessible, and reliable for everyone, both locally and abroad. Guided by our values of honesty, transparency, empowerment, and community, we go beyond property — we connect people to possibilities. Your trusted path to property.
        </p>

        <h2 className="font-display text-2xl text-foreground">Our Mission</h2>
        <p className="text-foreground/70">
          To make property ownership and hospitality in Rwanda effortless, profitable, and trusted. We combine professional management, transparent operations, and modern technology to deliver consistent guest experiences, protect asset value, and give owners complete peace of mind — whether they operate a single apartment, a boutique hotel, or a portfolio of rental properties.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          {[
            { icon: Hotel, title: "Hospitality Operations", desc: "Front-desk workflows, guest communication, check-ins, housekeeping coordination, and daily operations designed for hotels, lodges, and serviced apartments." },
            { icon: Key, title: "Property Management", desc: "End-to-end management for residential and commercial rentals: leasing, maintenance, tenant relations, inspections, and financial reporting." },
            { icon: Sparkles, title: "Quality & Standards", desc: "We set and maintain hospitality standards that keep guests returning, protect your reputation, and preserve the long-term value of your property." },
            { icon: Shield, title: "Trust & Transparency", desc: "Clear reporting, verified records, and secure handling of payments and data so owners always know exactly how their property is performing." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-card shadow-card">
              <Icon className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground">What We Offer</h2>
        <ul className="text-foreground/70">
          <li><strong className="text-foreground">Hospitality Management:</strong> Professional operations for hotels, lodges, guesthouses, and serviced apartments — including bookings, guest services, and housekeeping coordination.</li>
          <li><strong className="text-foreground">Residential Property Management:</strong> Leasing, tenant screening, rent collection, maintenance, inspections, and owner reporting for apartments and rental homes.</li>
          <li><strong className="text-foreground">Revenue & Booking Optimization:</strong> Dynamic pricing, channel management, and direct booking strategies to maximize occupancy and owner income.</li>
          <li><strong className="text-foreground">Maintenance & Service Network:</strong> A vetted network of cleaners, technicians, and hospitality suppliers keeping every property guest-ready.</li>
          <li><strong className="text-foreground">Secure Payments & Reporting:</strong> Transparent rent and guest-payment tracking with detailed financial statements and owner dashboards.</li>
          <li><strong className="text-foreground">Investment Advisory:</strong> Guidance for local and diaspora investors looking to acquire, develop, or reposition hospitality and residential assets in Rwanda.</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-10">
          {[
            { icon: Heart, label: "Honesty & Transparency" },
            { icon: Globe, label: "Local & Global Reach" },
            { icon: Users, label: "Community First" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-5 text-center">
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">{label}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground">Meet The Founders</h2>
        <p className="text-foreground/70 mb-8">
          EstatesRW is led by a passionate team dedicated to transforming Rwanda's real estate and hospitality landscape.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 not-prose">
          {[
            { name: "Fiston NTIRENGANYA", role: "Founder of Estatesrw", image: founderFiston },
            { name: "Joshua van Spankeren", role: "Co-Founder of Estatesrw", image: founderJoshua },
          ].map((member) => (
            <div key={member.name} className="bg-card rounded-xl shadow-card p-6 text-center border border-border hover:border-primary/20 hover:shadow-card-hover transition-all">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 bg-primary/10">
                <img src={member.image} alt={`${member.name} - ${member.role}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-xl">{member.name}</h3>
              <p className="text-primary text-sm font-medium">{member.role}</p>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl text-foreground">Contact Us</h2>

        <p className="text-foreground/70">
          We're always happy to hear from you. Whether you have questions about property management, hospitality services, partnership opportunities, or your account, don't hesitate to reach out.
        </p>
        <ul className="text-foreground/70">
          <li><strong className="text-foreground">Email:</strong> <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a></li>
          <li><strong className="text-foreground">Phone:</strong> +250 791 915 459</li>
          <li><strong className="text-foreground">Location:</strong> Kigali, Rwanda</li>
        </ul>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutUs;
