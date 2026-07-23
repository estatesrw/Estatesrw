import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navLinks = [
    { label: t("nav.properties"), href: "/dashboard/browse" },
    { label: "Services", href: "/services" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.about"), href: "/about-us" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar */}
      <div className="hidden md:block bg-primary text-primary-foreground text-xs">
        <div className="container mx-auto px-4 h-9 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="font-medium tracking-wide">
            Earn up to 5% commission with the EstatesRW Agent Referral Program
          </span>
          <Link to="/auth" className="underline underline-offset-2 hover:text-accent transition-colors ml-2">
            Join now →
          </Link>
        </div>
      </div>

      <nav className="bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={logo}
                alt="EstatesRW Logo"
                className="h-9 w-auto object-contain md:h-10 dark:brightness-0 dark:invert"
              />
            </Link>

            {/* Center: Nav links */}
            <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-4 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <LanguageSwitcher />
              <ThemeToggle />
              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                    {t("nav.dashboard")}
                  </Button>
                  <Button size="sm" onClick={handleSignOut} className="rounded-full">
                    {t("nav.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                    {t("nav.signIn")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="rounded-full bg-foreground text-background hover:bg-foreground/90"
                  >
                    Get started →
                  </Button>
                </>
              )}
            </div>

            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-fade-up">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-2 px-4 py-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
                <div className="flex flex-col gap-2 mt-2 px-4">
                  {user ? (
                    <>
                      <Button variant="outline" className="w-full" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
                        {t("nav.dashboard")}
                      </Button>
                      <Button className="w-full" onClick={handleSignOut}>
                        {t("nav.signOut")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                        {t("nav.signIn")}
                      </Button>
                      <Button className="w-full bg-foreground text-background hover:bg-foreground/90" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                        Get started →
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
