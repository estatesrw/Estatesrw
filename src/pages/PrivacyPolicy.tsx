import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Privacy Policy | EstatesRW</title>
      <meta name="description" content="Read EstatesRW's Privacy Policy to understand how we collect, use, and protect your personal information, including our use of Google AdSense and cookies." />
      <link rel="canonical" href="https://estatesrw.lovable.app/privacy" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: March 2, 2026</p>

        <h2 className="font-display text-2xl text-foreground">1. Information We Collect</h2>
        <p>We collect information you provide directly: name, email address, phone number, and property-related data when you create an account or list properties on EstatesRW. We may also automatically collect certain information when you visit our website, including your IP address, browser type, device information, pages visited, and referring URLs through cookies and similar technologies.</p>

        <h2 className="font-display text-2xl text-foreground">2. How We Use Your Information</h2>
        <p>Your information is used to provide and improve our platform services, facilitate property transactions, enable communication between tenants and landlords, send service-related notifications, personalize your experience, analyze usage patterns to improve our services, and display relevant advertisements through Google AdSense.</p>

        <h2 className="font-display text-2xl text-foreground">3. Google AdSense and Advertising</h2>
        <p>EstatesRW uses Google AdSense to display advertisements on our website. Google AdSense uses cookies and web beacons to serve ads based on your prior visits to our website and other websites on the Internet. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to EstatesRW and/or other sites on the Internet.</p>
        <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info</a>.</p>

        <h2 className="font-display text-2xl text-foreground">4. Cookies</h2>
        <p>We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amounts of data that are sent to your browser from a website and stored on your device. We use the following types of cookies:</p>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the website to function properly, including maintaining your session and preferences.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
          <li><strong>Advertising Cookies:</strong> Used by Google AdSense and other advertising partners to deliver relevant advertisements and track ad campaign performance.</li>
        </ul>
        <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.</p>

        <h2 className="font-display text-2xl text-foreground">5. Data Sharing</h2>
        <p>We do not sell your personal data. We may share information with service providers who assist in operating our platform, advertising partners including Google AdSense, or when required by law. Third-party advertisers may collect information about your browsing activities across websites to provide targeted advertising.</p>

        <h2 className="font-display text-2xl text-foreground">6. Data Security</h2>
        <p>We implement industry-standard security measures including encryption, secure authentication, and role-based access controls to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="font-display text-2xl text-foreground">7. Your Rights</h2>
        <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us. You also have the right to opt out of personalized advertising, request a copy of your data, and withdraw consent for data processing where applicable.</p>

        <h2 className="font-display text-2xl text-foreground">8. Children's Privacy</h2>
        <p>Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.</p>

        <h2 className="font-display text-2xl text-foreground">9. Changes to This Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

        <h2 className="font-display text-2xl text-foreground">10. Contact Us</h2>
        <p>For questions about this policy, contact us at <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a> or call +250 791 915 459.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
