import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { trackSocialClick } from "@/lib/analytics";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4c0 1.5 1.5 3 4 3v2.5c-2.5 0-4-1.5-4-3v8a4 4 0 1 1-4-4Z" />
  </svg>
);

const socialLinks = [
  {
    Icon: Facebook,
    href: "https://web.facebook.com/estatesrw?mibextid=wwXIfr&rdid=rnJxsUd5wBvJCkVZ&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F16RJFH4Nky%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr",
    label: "Facebook",
  },
  {
    Icon: Instagram,
    href: "https://www.instagram.com/estatesrw/",
    label: "Instagram",
  },
  {
    Icon: TikTokIcon,
    href: "https://www.tiktok.com/@estates_rw",
    label: "TikTok",
  },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/estates-rw-722783391",
    label: "LinkedIn",
  },
];

const Footer = () => {
  const footerLinks = {
    company: [
      { label: "About Us", href: "/about-us" },
      { label: "Properties", href: "/dashboard/browse" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  };

  return (
    <footer className="relative bg-sidebar text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img
                src={logo}
                alt="EstatesRW Logo"
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sidebar-foreground/70 mb-6 max-w-sm text-sm leading-relaxed">
              Rwanda's premier property management platform. Find your perfect home, list your property, or discover professional services.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackSocialClick(label, href)}
                  aria-label={`Follow EstatesRW on ${label}`}
                  className="w-9 h-9 rounded-full bg-sidebar-foreground/10 flex items-center justify-center hover:bg-sidebar-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-sidebar-foreground/60">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-sidebar-foreground/60">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/80 hover:text-sidebar-foreground transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-sidebar-foreground/60">Contact</h4>
            <ul className="space-y-3 text-sidebar-foreground/80 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Kigali, Rwanda
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +250 791 915 459
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@estatesrw.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sidebar-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} EstatesRW. All rights reserved.</p>
          <p>Built with care in Kigali, Rwanda.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
