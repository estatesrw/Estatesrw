import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home, Building2, Users, Wrench, MessageSquare, CreditCard,
  BarChart3, LogOut, Menu, X, FileText, ClipboardList,
  Briefcase, ShoppingBag, CalendarCheck, BedDouble, Calendar,
  DollarSign, Wallet, ChevronDown, Link2, Settings, UserPlus,
  PieChart, Shield, Heart
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface NavGroup {
  label: string;
  items: { label: string; href: string; icon: ReactNode }[];
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, roles, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const primaryRole = roles[0] || "tenant";

  const toggleGroup = (label: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const navGroups: NavGroup[] = (() => {
    switch (primaryRole) {
      case "vendor":
        return [
          { label: "Dashboard", items: [
            { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Property Management", items: [
            { label: "Properties", href: "/dashboard/vendor/properties", icon: <Building2 className="w-4 h-4" /> },
            { label: "Units / Rooms", href: "/dashboard/vendor/rooms", icon: <BedDouble className="w-4 h-4" /> },
            { label: "Bookings", href: "/dashboard/vendor/bookings", icon: <FileText className="w-4 h-4" /> },
            { label: "Calendar", href: "/dashboard/vendor/calendar", icon: <Calendar className="w-4 h-4" /> },
            { label: "Channels", href: "/dashboard/vendor/channels", icon: <Link2 className="w-4 h-4" /> },
          ]},
          { label: "Services", items: [
            { label: "Browse Services", href: "/dashboard/browse-services", icon: <ShoppingBag className="w-4 h-4" /> },
            { label: "Guests", href: "/dashboard/vendor/guests", icon: <Users className="w-4 h-4" /> },
          ]},
          { label: "Finance", items: [
            { label: "Revenue", href: "/dashboard/vendor/revenue", icon: <DollarSign className="w-4 h-4" /> },
            { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <Wallet className="w-4 h-4" /> },
          ]},
          { label: "Communication", items: [
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
      case "admin":
        return [
          { label: "Platform", items: [
            { label: "Overview", href: "/dashboard", icon: <PieChart className="w-4 h-4" /> },
            { label: "Analytics", href: "/dashboard/admin/analytics", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Management", items: [
            { label: "Properties", href: "/dashboard/properties", icon: <Building2 className="w-4 h-4" /> },
            { label: "Vendors", href: "/dashboard/admin/vendors", icon: <BedDouble className="w-4 h-4" /> },
            { label: "Bookings", href: "/dashboard/admin/bookings", icon: <CalendarCheck className="w-4 h-4" /> },
            { label: "Service Providers", href: "/dashboard/services", icon: <Briefcase className="w-4 h-4" /> },
            { label: "Agents", href: "/dashboard/admin/agents", icon: <UserPlus className="w-4 h-4" /> },
          ]},
          { label: "Users & Finance", items: [
            { label: "Users", href: "/dashboard/users", icon: <Users className="w-4 h-4" /> },
            { label: "Revenue", href: "/dashboard/admin/commissions", icon: <DollarSign className="w-4 h-4" /> },
            { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <Wallet className="w-4 h-4" /> },
            { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
          ]},
          { label: "Content", items: [
            { label: "Blog", href: "/dashboard/blog", icon: <FileText className="w-4 h-4" /> },
            { label: "Advertisements", href: "/dashboard/ads", icon: <Shield className="w-4 h-4" /> },
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
      case "landlord":
        return [
          { label: "Dashboard", items: [
            { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Properties", items: [
            { label: "My Properties", href: "/dashboard/properties", icon: <Building2 className="w-4 h-4" /> },
            { label: "Applications", href: "/dashboard/applications", icon: <ClipboardList className="w-4 h-4" /> },
            { label: "Bookings", href: "/dashboard/bookings", icon: <FileText className="w-4 h-4" /> },
            { label: "Maintenance", href: "/dashboard/maintenance", icon: <Wrench className="w-4 h-4" /> },
          ]},
          { label: "Finance", items: [
            { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
            { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <Wallet className="w-4 h-4" /> },
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
      case "service_provider":
        return [
          { label: "Dashboard", items: [
            { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Services", items: [
            { label: "My Services", href: "/dashboard/services", icon: <Briefcase className="w-4 h-4" /> },
            { label: "Booking Requests", href: "/dashboard/service-bookings", icon: <CalendarCheck className="w-4 h-4" /> },
          ]},
          { label: "Finance", items: [
            { label: "Revenue", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
            { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <Wallet className="w-4 h-4" /> },
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
      case "agent":
        return [
          { label: "Dashboard", items: [
            { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Referrals", items: [
            { label: "My Referrals", href: "/dashboard/agent/referrals", icon: <UserPlus className="w-4 h-4" /> },
            { label: "Browse Properties", href: "/dashboard/browse", icon: <Building2 className="w-4 h-4" /> },
          ]},
          { label: "Finance", items: [
            { label: "Commissions", href: "/dashboard/agent/commissions", icon: <DollarSign className="w-4 h-4" /> },
            { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <Wallet className="w-4 h-4" /> },
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
      default: // tenant / guest
        return [
          { label: "Dashboard", items: [
            { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
          ]},
          { label: "Accommodation", items: [
            { label: "Browse Stays", href: "/dashboard/accommodation", icon: <BedDouble className="w-4 h-4" /> },
            { label: "Browse Rentals", href: "/dashboard/browse", icon: <Building2 className="w-4 h-4" /> },
            { label: "My Bookings", href: "/dashboard/guest-bookings", icon: <CalendarCheck className="w-4 h-4" /> },
            { label: "Saved", href: "/dashboard/saved", icon: <Heart className="w-4 h-4" /> },
          ]},
          { label: "Services", items: [
            { label: "Browse Services", href: "/dashboard/browse-services", icon: <ShoppingBag className="w-4 h-4" /> },
            { label: "Service Bookings", href: "/dashboard/service-bookings", icon: <CalendarCheck className="w-4 h-4" /> },
          ]},
          { label: "Finance", items: [
            { label: "Payment History", href: "/dashboard/guest-payments", icon: <CreditCard className="w-4 h-4" /> },
            { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-4 h-4" /> },
          ]},
        ];
    }
  })();

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    vendor: "Property Vendor",
    landlord: "Landlord",
    service_provider: "Service Provider",
    tenant: "Guest",
    agent: "Referral Agent",
  };

  const roleLabel = roleLabels[primaryRole] || "User";

  const currentLabel = navGroups.flatMap(g => g.items).find(i => i.href === location.pathname)?.label || "Overview";
  const currentGroup = navGroups.find(g => g.items.some(i => i.href === location.pathname))?.label;

  return (
    <div className="min-h-screen bg-secondary/40 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-[264px] p-3 transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full bg-card border border-border rounded-3xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-semibold text-foreground tracking-tight">EstatesRW</span>
            </Link>
            <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mx-3 mb-3 rounded-2xl bg-secondary/70 border border-border/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{profile?.full_name || user?.email}</p>
                <p className="text-[11px] text-muted-foreground truncate">{roleLabel}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 pb-3 overflow-y-auto space-y-5">
            {navGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.label);
              return (
                <div key={group.label}>
                  <button onClick={() => toggleGroup(group.label)} className="flex items-center justify-between w-full px-3 mb-1.5 group">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/70">{group.label}</span>
                    <ChevronDown className={`w-3 h-3 text-muted-foreground/50 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                  </button>
                  {!isCollapsed && (
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const active = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
                              active
                                ? "bg-primary text-primary-foreground shadow-soft"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`}
                          >
                            <span className={active ? "text-primary-foreground" : "text-muted-foreground/80"}>{item.icon}</span>
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-3 py-3 border-t border-border">
            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full">
              <LogOut className="w-4 h-4" />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-[264px] min-w-0">
        <header className="sticky top-0 z-30 bg-secondary/70 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70 font-semibold">
              {currentGroup ? `${currentGroup} —` : ""} EstatesRW
            </p>
            <h1 className="font-display text-xl font-semibold text-foreground truncate leading-tight">{currentLabel}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1.5 shadow-soft">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </header>

        <main className="px-3 sm:px-4 md:px-6 pb-20 lg:pb-6">
          <div className="bg-background border border-border rounded-3xl shadow-card p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-6.5rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

};

export default DashboardLayout;
