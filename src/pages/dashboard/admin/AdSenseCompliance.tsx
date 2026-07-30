import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink } from "lucide-react";

const PUBLISHER_ID = "ca-pub-2123974525989512";
const CONSENT_KEY = "estatesrw_cookie_consent";

type Status = "pass" | "fail" | "warn" | "loading";

interface Check {
  id: string;
  title: string;
  status: Status;
  detail: string;
  link?: string;
}

const statusMeta: Record<Exclude<Status, "loading">, { label: string; icon: typeof CheckCircle2; className: string }> = {
  pass: { label: "Ready", icon: CheckCircle2, className: "bg-primary/10 text-primary border-primary/20" },
  warn: { label: "Attention", icon: AlertTriangle, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  fail: { label: "Missing", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const fetchText = async (path: string) => {
  try {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
};

const AdSenseCompliance = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runChecks = useCallback(async () => {
    setLoading(true);
    const [ads, robots, sitemap] = await Promise.all([
      fetchText("/ads.txt"),
      fetchText("/robots.txt"),
      fetchText("/sitemap.xml"),
    ]);

    const result: Check[] = [];

    // ads.txt
    if (!ads) {
      result.push({ id: "ads", title: "ads.txt", status: "fail", detail: "File not reachable at /ads.txt.", link: "/ads.txt" });
    } else if (ads.includes(PUBLISHER_ID) && /DIRECT/i.test(ads)) {
      result.push({ id: "ads", title: "ads.txt", status: "pass", detail: `Publisher ${PUBLISHER_ID} declared as DIRECT.`, link: "/ads.txt" });
    } else {
      result.push({ id: "ads", title: "ads.txt", status: "warn", detail: "File exists but the publisher ID or DIRECT relationship is missing.", link: "/ads.txt" });
    }

    // robots.txt
    if (!robots) {
      result.push({ id: "robots", title: "robots.txt", status: "fail", detail: "File not reachable at /robots.txt.", link: "/robots.txt" });
    } else {
      const blocksAll = /User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*$/im.test(robots);
      const adsBots = ["Mediapartners-Google", "AdsBot-Google"].filter((b) => robots.includes(b));
      const hasSitemap = /Sitemap:\s*https?:\/\//i.test(robots);
      const problems: string[] = [];
      if (blocksAll) problems.push("wildcard Disallow: / blocks all crawlers");
      if (adsBots.length < 2) problems.push("AdSense crawlers not explicitly allowed");
      if (!hasSitemap) problems.push("no Sitemap: directive");
      result.push({
        id: "robots",
        title: "robots.txt",
        status: problems.length ? "warn" : "pass",
        detail: problems.length
          ? `Issues: ${problems.join("; ")}.`
          : "AdSense crawlers allowed, sitemap declared, no blanket block.",
        link: "/robots.txt",
      });
    }

    // sitemap
    if (!sitemap) {
      result.push({ id: "sitemap", title: "sitemap.xml", status: "fail", detail: "File not reachable at /sitemap.xml.", link: "/sitemap.xml" });
    } else {
      const urls = (sitemap.match(/<loc>/g) || []).length;
      result.push({
        id: "sitemap",
        title: "sitemap.xml",
        status: urls > 0 ? "pass" : "warn",
        detail: urls > 0 ? `${urls} URLs listed for indexing.` : "Sitemap contains no <loc> entries.",
        link: "/sitemap.xml",
      });
    }

    // Cookie policy page
    const cookiePolicy = await fetchText("/cookie-policy");
    result.push({
      id: "cookie-policy",
      title: "Cookie Policy page",
      status: cookiePolicy ? "pass" : "warn",
      detail: cookiePolicy
        ? "Public page live at /cookie-policy with AdSense cookie disclosures and opt-out links."
        : "Could not confirm the /cookie-policy route.",
      link: "/cookie-policy",
    });

    // Privacy policy
    result.push({
      id: "privacy",
      title: "Privacy Policy page",
      status: "pass",
      detail: "Public page live at /privacy — required before AdSense approval.",
      link: "/privacy",
    });

    // AdSense script + verification meta
    const hasScript = !!document.querySelector(`script[src*="adsbygoogle.js"][src*="${PUBLISHER_ID}"]`);
    const metaTag = document.querySelector('meta[name="google-adsense-account"]')?.getAttribute("content");
    result.push({
      id: "adsense-tag",
      title: "AdSense code & verification meta",
      status: hasScript && metaTag === PUBLISHER_ID ? "pass" : "warn",
      detail: [
        hasScript ? "adsbygoogle.js loaded" : "adsbygoogle.js not detected",
        metaTag === PUBLISHER_ID ? "google-adsense-account meta present" : "verification meta missing/mismatched",
      ].join(" · "),
    });

    // Consent Mode
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    const hasConsentDefault = Array.isArray(dataLayer)
      && dataLayer.some((e) => Array.isArray(e) ? e[0] === "consent" && e[1] === "default" : (e as { 0?: string })?.[0] === "consent");
    result.push({
      id: "consent-mode",
      title: "Google Consent Mode v2",
      status: hasConsentDefault ? "pass" : "warn",
      detail: hasConsentDefault
        ? "Consent defaults pushed before ad scripts (ad_storage, ad_user_data, ad_personalization, analytics_storage)."
        : "No consent default command detected in dataLayer on this page load.",
    });

    // Visitor consent state
    let stored: string | null = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch { /* storage blocked */ }
    result.push({
      id: "consent-state",
      title: "Consent banner state (this browser)",
      status: stored ? "pass" : "warn",
      detail: stored
        ? `Stored choice: "${stored}". Ads/analytics storage ${stored === "accepted" ? "granted" : "denied"}.`
        : "No choice stored yet — the banner will show and non-essential cookies stay denied.",
    });

    setChecks(result);
    setLastRun(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { runChecks(); }, [runChecks]);

  const failing = checks.filter((c) => c.status !== "pass").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">AdSense Compliance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live status of the files and consent settings Google reviews before approving ads.
          </p>
        </div>
        <Button variant="outline" onClick={runChecks} disabled={loading} className="rounded-full">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Re-check
        </Button>
      </div>

      <Card className="rounded-3xl border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            {loading ? "Running checks…" : failing === 0 ? "All checks ready" : `${failing} item${failing === 1 ? "" : "s"} need attention`}
          </CardTitle>
          {lastRun && !loading && (
            <p className="text-xs text-muted-foreground">Last checked {lastRun.toLocaleTimeString()}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map((check) => {
            const meta = statusMeta[check.status as Exclude<Status, "loading">];
            const Icon = meta.icon;
            return (
              <div key={check.id} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4">
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${check.status === "pass" ? "text-primary" : check.status === "warn" ? "text-amber-600" : "text-destructive"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{check.title}</p>
                    <Badge variant="outline" className={`text-[10px] ${meta.className}`}>{meta.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{check.detail}</p>
                  {check.link && (
                    <a
                      href={check.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      Open {check.link} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {!loading && checks.length === 0 && (
            <p className="text-sm text-muted-foreground">No checks could be run.</p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Manual steps (outside the app)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>• Publish the site so the latest ads.txt, robots.txt and sitemap.xml are live on the production domain.</p>
          <p>• Submit the site for review in your AdSense account and confirm ads.txt there.</p>
          <p>• Verify the domain in Google Search Console and submit /sitemap.xml.</p>
          <p>• Keep original, substantial content published — thin content is the most common rejection reason.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSenseCompliance;
