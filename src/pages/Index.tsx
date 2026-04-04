import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AdBanner from "@/components/home/AdBanner";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HowItWorks from "@/components/home/HowItWorks";
import ServicesSection from "@/components/home/ServicesSection";
import ProductShowcase from "@/components/home/ProductShowcase";
import TrustedBySection from "@/components/home/TrustedBySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import PartnersSlider from "@/components/home/PartnersSlider";
import PlatformOverview from "@/components/home/PlatformOverview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>EstatesRW - Rwanda's Premier Real Estate Platform</title>
        <meta name="description" content="Find your perfect home in Rwanda. Browse verified rental properties, buy property, list your home, or discover professional real estate services on EstatesRW." />
        <link rel="canonical" href="https://estatesrw.lovable.app/" />
        <meta property="og:title" content="EstatesRW - Rwanda's Premier Real Estate Platform" />
        <meta property="og:description" content="Find your perfect home in Rwanda. Browse verified rental properties, list your property, or discover professional property services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://estatesrw.lovable.app/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "EstatesRW",
          "url": "https://estatesrw.lovable.app",
          "description": "Rwanda's premier real estate platform for buying, renting, and property management.",
          "address": { "@type": "PostalAddress", "addressLocality": "Kigali", "addressCountry": "RW" },
          "telephone": "+250791915459",
          "email": "info@estatesrw.com"
        })}</script>
      </Helmet>
      <Navbar />
      <main>
        <HeroSection />
        <AdBanner />
        <TrustedBySection />
        <PartnersSlider />
        <FeaturedProperties />
        <HowItWorks />
        <ProductShowcase />
        <ServicesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
