import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AdBanner from "@/components/home/AdBanner";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesSection from "@/components/home/ServicesSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import TrustedBySection from "@/components/home/TrustedBySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PartnersSlider from "@/components/home/PartnersSlider";
import PlatformOverview from "@/components/home/PlatformOverview";
import WhatWeDo from "@/components/home/WhatWeDo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>EstatesRW — Property Management & Investment in Rwanda</title>
        <meta name="description" content="EstatesRW is Rwanda's professional property management company. Investment advisory, curated property access, and a full-service management platform for owners and investors." />
        <link rel="canonical" href="https://estatesrw.lovable.app/" />
        <meta property="og:title" content="EstatesRW — Property Management & Investment in Rwanda" />
        <meta property="og:description" content="Professional property management, investment advisory, and a technology platform helping owners and investors operate and grow their real estate in Rwanda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://estatesrw.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "EstatesRW",
          "url": "https://estatesrw.lovable.app",
          "description": "Rwanda's professional property management and real estate investment company.",
          "address": { "@type": "PostalAddress", "addressLocality": "Kigali", "addressCountry": "RW" },
          "telephone": "+250791915459",
          "email": "info@estatesrw.com"
        })}</script>
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <WhatWeDo />
        <PlatformOverview />
        <AdBanner />
        <HowItWorks />
        <ProductShowcase />
        <ServicesSection />
        <PartnersSlider />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
