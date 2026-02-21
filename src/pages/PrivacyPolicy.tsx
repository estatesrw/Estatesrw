import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: February 21, 2026</p>

        <h2 className="font-display text-2xl text-foreground">1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, phone number, and property-related data when you create an account or list properties on EstatesRW.</p>

        <h2 className="font-display text-2xl text-foreground">2. How We Use Your Information</h2>
        <p>Your information is used to provide and improve our platform services, facilitate property transactions, enable communication between tenants and landlords, and send service-related notifications.</p>

        <h2 className="font-display text-2xl text-foreground">3. Data Sharing</h2>
        <p>We do not sell your personal data. We may share information with service providers who assist in operating our platform, or when required by law.</p>

        <h2 className="font-display text-2xl text-foreground">4. Data Security</h2>
        <p>We implement industry-standard security measures including encryption, secure authentication, and role-based access controls to protect your personal information.</p>

        <h2 className="font-display text-2xl text-foreground">5. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.</p>

        <h2 className="font-display text-2xl text-foreground">6. Cookies</h2>
        <p>We use essential cookies to maintain your session and preferences. No third-party tracking cookies are used without your consent.</p>

        <h2 className="font-display text-2xl text-foreground">7. Contact Us</h2>
        <p>For questions about this policy, contact us at <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a> or call +250 791 915 459.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
