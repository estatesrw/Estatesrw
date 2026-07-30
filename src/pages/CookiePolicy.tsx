import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

const resetConsent = () => {
  localStorage.removeItem("estatesrw_cookie_consent");
  window.location.reload();
};

const CookiePolicy = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Cookie Policy | EstatesRW</title>
      <meta name="description" content="How EstatesRW uses cookies and similar technologies, including Google AdSense advertising cookies, and how you can manage or withdraw your consent." />
      <link rel="canonical" href="https://estatesrw.lovable.app/cookie-policy" />
    </Helmet>
    <Navbar />
    <main className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
      <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
        <p className="text-foreground font-medium">Last updated: July 30, 2026</p>

        <p>This Cookie Policy explains how EstatesRW ("we", "us") uses cookies and similar technologies on https://estatesrw.lovable.app. It should be read together with our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.</p>

        <h2 className="font-display text-2xl text-foreground">What are cookies?</h2>
        <p>Cookies are small text files placed on your device when you visit a website. They allow the site to remember your actions and preferences (such as login state, language, and dark mode) over a period of time, and they help website owners and advertisers understand how a site is used.</p>

        <h2 className="font-display text-2xl text-foreground">Categories of cookies we use</h2>
        <ul>
          <li><strong>Strictly necessary cookies</strong> — required for authentication, session security and core platform functionality. These cannot be switched off.</li>
          <li><strong>Preference cookies</strong> — remember your language (English, French, Kinyarwanda, Swahili) and light/dark theme choice.</li>
          <li><strong>Analytics cookies</strong> — help us measure page views and how visitors move through the site so we can improve it.</li>
          <li><strong>Advertising cookies</strong> — set by Google AdSense and its partners to serve and measure ads, limit how often you see the same ad, and (where you consent) personalise the ads you see.</li>
        </ul>

        <h2 className="font-display text-2xl text-foreground">Third-party advertising (Google AdSense)</h2>
        <p>We display advertising supplied by Google AdSense (publisher ID ca-pub-2123974525989512). Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to EstatesRW and/or other sites on the Internet.</p>
        <p>You can opt out of personalised advertising at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>, review Google's practices at <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">How Google uses information from sites that use our services</a>, or opt out of participating vendors at <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.aboutads.info/choices</a> and <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">youronlinechoices.eu</a>.</p>

        <h2 className="font-display text-2xl text-foreground">Consent and EU/UK users</h2>
        <p>Visitors from the European Economic Area, the United Kingdom and Switzerland are shown a consent banner before non-essential cookies are set. We implement Google Consent Mode v2: advertising and analytics storage remain denied until you click "Accept All". If you decline, advertising is limited to non-personalised ads where served at all.</p>

        <h2 className="font-display text-2xl text-foreground">Managing your choices</h2>
        <p>You can change or withdraw your consent at any time using the button below, or by clearing cookies and site data in your browser settings. Blocking all cookies may prevent parts of the platform (such as signing in) from working.</p>
        <Button onClick={resetConsent} className="not-prose">Change my cookie preferences</Button>

        <h2 className="font-display text-2xl text-foreground">Contact</h2>
        <p>Questions about this policy? Email <a href="mailto:info@estatesrw.com" className="text-primary hover:underline">info@estatesrw.com</a> or call +250 791 915 459.</p>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
