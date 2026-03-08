import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.about"), href: "/about-us" },
    { label: t("nav.contact"), href: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="EstatesRW Logo" className="h-10 w-auto object-contain md:h-12 dark:brightness-0 dark:invert" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>{t("nav.dashboard")}</Button>
                <Button variant="outline" onClick={handleSignOut}>{t("nav.signOut")}</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>{t("nav.signIn")}</Button>
                <Button variant="default" onClick={() => navigate("/auth")}>{t("nav.listProperty")}</Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} className="px-4 py-3 text-foreground hover:bg-secondary rounded-lg transition-colors" onClick={() => setIsOpen(false)}>
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
                    <Button variant="outline" className="w-full" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>{t("nav.dashboard")}</Button>
                    <Button variant="default" className="w-full" onClick={handleSignOut}>{t("nav.signOut")}</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>{t("nav.signIn")}</Button>
                    <Button variant="default" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>{t("nav.listProperty")}</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
