import { useEffect, useRef } from "react";

const partners = [
  { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
  { name: "Booking.com", logo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg" },
  { name: "Rwanda Housing Authority", logo: "https://rha.gov.rw/fileadmin/templates/img/logo.png" },
  { name: "BK Group", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Bank_of_Kigali_logo.svg/200px-Bank_of_Kigali_logo.svg.png" },
  { name: "MTN Rwanda", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.svg" },
  { name: "Irembo", logo: "https://irembo.gov.rw/assets/images/irembo-logo.svg" },
  { name: "RDB", logo: "https://rdb.rw/wp-content/uploads/2020/01/rdb-logo.png" },
  { name: "Equity Bank", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Equity_Bank_logo.svg/200px-Equity_Bank_logo.svg.png" },
];

// Duplicate for seamless loop
const allPartners = [...partners, ...partners];

const PartnersSlider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let animId: number;
    let pos = 0;
    const speed = 0.5;

    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="py-12 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 mb-8">
        <div className="text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Our Partners
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2">
            Trusted By Leading Brands
          </h2>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-12 overflow-hidden whitespace-nowrap px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allPartners.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex-shrink-0 flex items-center justify-center h-16 w-36 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <img
              src={p.logo}
              alt={`${p.name} logo`}
              className="max-h-12 max-w-full object-contain"
              loading="lazy"
              onError={(e) => {
                // Fallback: show text if logo fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.innerHTML = `<span class="text-sm font-semibold text-muted-foreground">${p.name}</span>`;
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSlider;
