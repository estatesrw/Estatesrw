import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

const TermsAndConditions = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Terms and Conditions | EstatesRW</title>
      <meta name="description" content="Read the Terms and Conditions for using the EstatesRW real estate platform, including user responsibilities, property listings, and service agreements." />
      <link rel="canonical" href="https://estatesrw.lovable.app/terms-and-conditions" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: March 2, 2026</p>

        <h2 className="font-display text-2xl text-foreground">1. Acceptance of Terms</h2>
        <p>By accessing or using the EstatesRW platform ("Service"), you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you must not use or access the Service. These terms apply to all visitors, users, landlords, tenants, and service providers who access or use the platform.</p>

        <h2 className="font-display text-2xl text-foreground">2. User Accounts</h2>
        <p>To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate, current, and complete information during registration and keep your account information updated. EstatesRW reserves the right to suspend or terminate accounts that violate these terms.</p>

        <h2 className="font-display text-2xl text-foreground">3. Property Listings</h2>
        <p>Landlords and property owners who list properties on EstatesRW are solely responsible for the accuracy, completeness, and legality of their listings. EstatesRW does not guarantee the accuracy of any property information, pricing, availability, or condition. We act as a marketplace connecting property owners with potential tenants and do not own, manage, or control any listed properties unless explicitly stated.</p>

        <h2 className="font-display text-2xl text-foreground">4. User Conduct</h2>
        <p>Users agree not to use the Service for any unlawful purpose, post false or misleading information, harass or discriminate against other users, attempt to gain unauthorized access to other accounts or systems, or use automated means to scrape or extract data from the platform. Violation of these rules may result in immediate account termination.</p>

        <h2 className="font-display text-2xl text-foreground">5. Payments and Fees</h2>
        <p>Any payments processed through EstatesRW are subject to our payment processing terms. We may charge service fees for certain features or transactions. All fees are clearly disclosed before any transaction is completed. Users are responsible for any taxes applicable to their transactions. Refund policies are handled on a case-by-case basis.</p>

        <h2 className="font-display text-2xl text-foreground">6. Intellectual Property</h2>
        <p>The Service and its original content, features, and functionality are owned by EstatesRW and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. Users retain ownership of content they post but grant EstatesRW a non-exclusive license to use, display, and distribute such content on the platform.</p>

        <h2 className="font-display text-2xl text-foreground">7. Limitation of Liability</h2>
        <p>EstatesRW shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. Our total liability for any claim arising from these terms shall not exceed the amount you paid to EstatesRW in the twelve months preceding the claim. We do not guarantee the uninterrupted or error-free operation of the Service.</p>

        <h2 className="font-display text-2xl text-foreground">8. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. We will notify users of material changes by posting the updated terms on this page with a new "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the modified terms.</p>

        <h2 className="font-display text-2xl text-foreground">9. Contact</h2>
        <p>If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a> or call +250 791 915 459.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsAndConditions;
