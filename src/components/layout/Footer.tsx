import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

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
    ],
  };

  return (
    <footer className="relative bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] pointer-events-none"
      >
        <source
          src="https://videos.pexels.com/video-files/5765298/5765298-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay to keep text readable */}
      <div className="absolute inset-0 bg-sidebar/80 pointer-events-none" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src={logo} alt="EstatesRW Logo" className="h-14 w-auto object-contain brightness-0 invert" />
            </div>
            <p className="text-sidebar-foreground/70 mb-6 max-w-sm">
              Rwanda's premier property management platform. Find your perfect home, list your property, or discover professional services.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-sidebar-foreground/10 flex items-center justify-center hover:bg-sidebar-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sidebar-foreground/70">
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

        <div className="border-t border-sidebar-foreground/10 mt-12 pt-8 text-center text-sidebar-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} EstatesRW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
