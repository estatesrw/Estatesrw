import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Home, Building2, TreePine, Mountain, Sun, Star } from "lucide-react";
import logo from "@/assets/logo.png";

// Imigongo-inspired SVG pattern
const ImigongoPattern = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <pattern id="imigongo" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        {/* Diamond shapes - classic Imigongo */}
        <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.15" />
        <path d="M20 5 L35 20 L20 35 L5 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <path d="M20 10 L30 20 L20 30 L10 20 Z" fill="currentColor" opacity="0.05" />
        {/* Corner triangles */}
        <path d="M0 0 L10 0 L0 10 Z" fill="currentColor" opacity="0.08" />
        <path d="M40 0 L40 10 L30 0 Z" fill="currentColor" opacity="0.08" />
        <path d="M0 40 L0 30 L10 40 Z" fill="currentColor" opacity="0.08" />
        <path d="M40 40 L30 40 L40 30 Z" fill="currentColor" opacity="0.08" />
      </pattern>
      <pattern id="imigongo-zigzag" x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 L15 0 L30 10 L45 0 L60 10 L45 20 L30 10 L15 20 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
      </pattern>
    </defs>
    <rect width="200" height="200" fill="url(#imigongo)" />
  </svg>
);

const ImigongoBorder = () => (
  <svg className="w-full h-8" viewBox="0 0 1200 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="hsl(38 92% 50%)" stopOpacity="0.8" />
        <stop offset="50%" stopColor="hsl(38 92% 60%)" stopOpacity="1" />
        <stop offset="100%" stopColor="hsl(38 92% 50%)" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    {/* Imigongo zigzag border */}
    {Array.from({ length: 40 }).map((_, i) => (
      <path
        key={i}
        d={`M${i * 30} 16 L${i * 30 + 15} 0 L${i * 30 + 30} 16 L${i * 30 + 15} 32 Z`}
        fill="none"
        stroke="url(#borderGrad)"
        strokeWidth="1.5"
        opacity="0.6"
      />
    ))}
    <line x1="0" y1="16" x2="1200" y2="16" stroke="url(#borderGrad)" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

// Floating animated icons
const FloatingIcon = ({ children, delay, duration, x }: { children: React.ReactNode; delay: string; duration: string; x: string }) => (
  <div
    className="absolute text-sidebar-foreground/10 pointer-events-none"
    style={{
      left: x,
      animation: `footerFloat ${duration} ease-in-out ${delay} infinite`,
    }}
  >
    {children}
  </div>
);

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Properties", href: "/dashboard/browse" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    support: [
      { label: "Help Center", href: "/contact" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "FAQs", href: "/contact" },
      { label: "Dashboard", href: "/dashboard" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  };

  return (
    <footer className="relative bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Imigongo pattern overlay */}
      <ImigongoPattern className="absolute inset-0 w-full h-full text-sidebar-foreground opacity-60" />

      {/* Imigongo decorative top border */}
      <ImigongoBorder />

      {/* Floating animated icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon delay="0s" duration="8s" x="5%">
          <Home className="w-8 h-8" />
        </FloatingIcon>
        <FloatingIcon delay="1.5s" duration="7s" x="15%">
          <Building2 className="w-6 h-6" />
        </FloatingIcon>
        <FloatingIcon delay="3s" duration="9s" x="30%">
          <TreePine className="w-7 h-7" />
        </FloatingIcon>
        <FloatingIcon delay="0.5s" duration="6s" x="50%">
          <Mountain className="w-8 h-8" />
        </FloatingIcon>
        <FloatingIcon delay="2s" duration="8s" x="65%">
          <Home className="w-5 h-5" />
        </FloatingIcon>
        <FloatingIcon delay="4s" duration="7s" x="78%">
          <Sun className="w-6 h-6" />
        </FloatingIcon>
        <FloatingIcon delay="1s" duration="9s" x="90%">
          <Star className="w-5 h-5" />
        </FloatingIcon>
        <FloatingIcon delay="2.5s" duration="6.5s" x="42%">
          <Building2 className="w-7 h-7" />
        </FloatingIcon>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6 group">
              <img
                src={logo}
                alt="EstatesRW Logo"
                className="h-14 w-auto object-contain brightness-0 invert transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sidebar-foreground/70 mb-6 max-w-sm leading-relaxed">
              Rwanda's premier property management platform. Find your perfect home, list your property, or discover professional services.
            </p>

            {/* Social icons with Imigongo-style borders */}
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Linkedin, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="group/social relative w-11 h-11 flex items-center justify-center transition-all duration-300"
                >
                  {/* Diamond background shape */}
                  <span className="absolute inset-0 rotate-45 rounded-sm bg-sidebar-foreground/10 group-hover/social:bg-accent group-hover/social:scale-110 transition-all duration-300" />
                  <Icon className="w-5 h-5 relative z-10 group-hover/social:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-display font-semibold mb-5 text-lg relative inline-block">
              Company
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sidebar-foreground/70 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-5 text-lg relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sidebar-foreground/70 hover:text-accent transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-5 text-lg relative inline-block">
              Contact
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-accent rounded-full" />
            </h4>
            <ul className="space-y-4 text-sidebar-foreground/70">
              <li className="flex items-center gap-3 group/contact hover:text-sidebar-foreground transition-colors duration-300">
                <span className="w-8 h-8 rounded-full bg-sidebar-foreground/10 flex items-center justify-center group-hover/contact:bg-accent/20 transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </span>
                Kigali, Rwanda
              </li>
              <li className="flex items-center gap-3 group/contact hover:text-sidebar-foreground transition-colors duration-300">
                <span className="w-8 h-8 rounded-full bg-sidebar-foreground/10 flex items-center justify-center group-hover/contact:bg-accent/20 transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </span>
                +250 791 915 459
              </li>
              <li className="flex items-center gap-3 group/contact hover:text-sidebar-foreground transition-colors duration-300">
                <span className="w-8 h-8 rounded-full bg-sidebar-foreground/10 flex items-center justify-center group-hover/contact:bg-accent/20 transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </span>
                info@estatesrw.com
              </li>
            </ul>
          </div>
        </div>

        {/* Imigongo-style divider */}
        <div className="mt-12 mb-8 flex items-center gap-3">
          <div className="flex-1 h-px bg-sidebar-foreground/10" />
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rotate-45 border border-accent/40"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className="flex-1 h-px bg-sidebar-foreground/10" />
        </div>

        {/* Bottom bar */}
        <div className="text-center text-sidebar-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} EstatesRW. All rights reserved.</p>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes footerFloat {
          0%, 100% {
            transform: translateY(100%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(15deg);
            opacity: 0;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
