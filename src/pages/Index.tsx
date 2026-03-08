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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
