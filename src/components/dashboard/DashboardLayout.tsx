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
            { label: "Browse Properties", href: "/dashboard/browse", icon: <Building2 className="w-4 h-4" /> },
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

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Home className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-sidebar-foreground">EstatesRW</span>
            </Link>
            <button className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-3 border-b border-sidebar-border">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{profile?.full_name || user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sidebar-primary/20 text-sidebar-primary font-medium mt-1 inline-block">{roleLabel}</span>
          </div>

          <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
            {navGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.label);
              return (
                <div key={group.label}>
                  <button onClick={() => toggleGroup(group.label)} className="flex items-center justify-between w-full px-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-sidebar-foreground/40">{group.label}</span>
                    <ChevronDown className={`w-3 h-3 text-sidebar-foreground/30 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
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
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            }`}
                          >
                            {item.icon}
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

          <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
            <button onClick={handleSignOut} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-sidebar-foreground/50 hover:bg-destructive/20 hover:text-destructive transition-all w-full">
              <LogOut className="w-4 h-4" />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-sans text-sm font-semibold text-foreground">
              {navGroups.flatMap(g => g.items).find(i => i.href === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
