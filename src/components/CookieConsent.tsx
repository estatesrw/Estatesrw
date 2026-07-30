import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const CONSENT_KEY = "estatesrw_cookie_consent";

const updateConsentMode = (granted: boolean) => {
  const value = granted ? "granted" : "denied";
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: any[]) {
    w.dataLayer.push(args);
  }
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    updateConsentMode(true);
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    updateConsentMode(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom-5 duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Cookie className="w-6 h-6 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">We value your privacy</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to keep you signed in, remember your preferences, analyze traffic,
              and serve advertising through Google AdSense. Advertising and analytics cookies are only set after you
              click "Accept All". You can withdraw consent at any time. Read our{" "}
              <a href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</a> and{" "}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={decline} className="flex-1 md:flex-none text-xs">
            Decline
          </Button>
          <Button size="sm" onClick={accept} className="flex-1 md:flex-none text-xs">
            Accept All
          </Button>
        </div>
        <button onClick={decline} aria-label="Close cookie banner" className="absolute top-3 right-3 md:hidden text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
