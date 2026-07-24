import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const CountUp = ({ end, decimals = 0, prefix = "", suffix = "", duration = 1.5 }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let raf: number;
    const durationMs = duration * 1000;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      setValue(end * progress);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);

  const formatted = decimals === 0 ? Math.round(value).toString() : value.toFixed(decimals);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
