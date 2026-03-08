import { Link } from "react-router-dom";
import { Home, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

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
    <footer className="bg-sidebar-background text-sidebar-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">EstatesRW</span>
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
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-primary-foreground/70">
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

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-primary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} EstatesRW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
