// Lightweight analytics helper.
// Pushes events to GA4 (window.gtag) and GTM (window.dataLayer) when present.
// Safe to call even if no analytics provider is loaded.

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const trackEvent = (eventName: string, params: EventParams = {}) => {
  const payload = { event: eventName, ...params };

  try {
    if (typeof window === "undefined") return;

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(payload);
    }

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", eventName, params);
    }
  } catch {
    // Never break the UI because of analytics.
  }
};

export const trackSocialClick = (network: string, url: string) =>
  trackEvent("social_icon_click", {
    social_network: network,
    link_url: url,
    location: "footer",
  });

export const trackCTAClick = (
  ctaId: string,
  location: string,
  destination: string,
) =>
  trackEvent("cta_click", {
    cta_id: ctaId,
    location,
    destination,
  });
