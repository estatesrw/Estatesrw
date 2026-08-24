import { useEffect, useRef } from "react";

/**
 * AdSense publisher ID and configured ad unit slot IDs.
 * Create the ad units in your AdSense dashboard, then paste the numeric
 * slot IDs here. Slots left empty are skipped (Auto ads still apply).
 */
export const AD_CLIENT = "ca-pub-2123974525989512";

export const AD_SLOTS = {
  articleInline: "",
  articleEnd: "",
  homeBanner: "",
} as const;

export type AdSlotName = keyof typeof AD_SLOTS;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  /** Numeric AdSense ad unit slot ID, or a name from AD_SLOTS. */
  slot?: string;
  name?: AdSlotName;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: boolean;
}

const AdSlot = ({
  slot,
  name,
  format = "auto",
  className = "",
  style,
  label = true,
}: AdSlotProps) => {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const resolvedSlot = slot || (name ? AD_SLOTS[name] : "");

  useEffect(() => {
    if (!resolvedSlot || pushed.current) return;
    const el = insRef.current;
    if (!el) return;

    // Only push once per <ins>, and only when it has a real width —
    // AdSense silently drops units rendered inside a zero-width container.
    const tryPush = () => {
      if (pushed.current) return;
      if (el.getAttribute("data-adsbygoogle-status")) {
        pushed.current = true;
        return;
      }
      if (el.offsetWidth === 0) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.warn("adsbygoogle push failed", e);
      }
    };

    tryPush();
    if (pushed.current) return;

    const observer = new ResizeObserver(() => {
      tryPush();
      if (pushed.current) observer.disconnect();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [resolvedSlot]);

  if (!resolvedSlot) return null;

  return (
    <div className={`w-full text-center ${className}`}>
      {label && (
        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
          Advertisement
        </span>
      )}
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={resolvedSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
