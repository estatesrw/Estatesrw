import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home, Building2, Users, Wrench, MessageSquare, CreditCard,
  BarChart3, Settings, LogOut, Menu, X, FileText, ClipboardList,
  Briefcase, ShoppingBag, CalendarCheck
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user, roles, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const primaryRole = roles[0] || "tenant";

  const navItems: NavItem[] = (() => {
    switch (primaryRole) {
      case "landlord":
        return [
          { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
          { label: "Properties", href: "/dashboard/properties", icon: <Building2 className="w-5 h-5" /> },
          { label: "Browse Services", href: "/dashboard/browse-services", icon: <ShoppingBag className="w-5 h-5" /> },
          { label: "Applications", href: "/dashboard/applications", icon: <ClipboardList className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/bookings", icon: <FileText className="w-5 h-5" /> },
          { label: "Maintenance", href: "/dashboard/maintenance", icon: <Wrench className="w-5 h-5" /> },
          { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
          { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-5 h-5" /> },
        ];
      case "admin":
        return [
          { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
          { label: "Users", href: "/dashboard/users", icon: <Users className="w-5 h-5" /> },
          { label: "Properties", href: "/dashboard/properties", icon: <Building2 className="w-5 h-5" /> },
          { label: "Services", href: "/dashboard/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Applications", href: "/dashboard/applications", icon: <ClipboardList className="w-5 h-5" /> },
          { label: "Bookings", href: "/dashboard/bookings", icon: <FileText className="w-5 h-5" /> },
          { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
        ];
      case "service_provider":
        return [
          { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
          { label: "My Services", href: "/dashboard/services", icon: <Briefcase className="w-5 h-5" /> },
          { label: "Service Requests", href: "/dashboard/service-bookings", icon: <CalendarCheck className="w-5 h-5" /> },
          { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
          { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-5 h-5" /> },
        ];
      default: // tenant
        return [
          { label: "Overview", href: "/dashboard", icon: <BarChart3 className="w-5 h-5" /> },
          { label: "Browse Properties", href: "/dashboard/browse", icon: <Building2 className="w-5 h-5" /> },
          { label: "Browse Services", href: "/dashboard/browse-services", icon: <ShoppingBag className="w-5 h-5" /> },
          { label: "My Applications", href: "/dashboard/applications", icon: <ClipboardList className="w-5 h-5" /> },
          { label: "My Bookings", href: "/dashboard/bookings", icon: <FileText className="w-5 h-5" /> },
          { label: "Service Bookings", href: "/dashboard/service-bookings", icon: <CalendarCheck className="w-5 h-5" /> },
          { label: "Maintenance", href: "/dashboard/maintenance", icon: <Wrench className="w-5 h-5" /> },
          { label: "Messages", href: "/dashboard/messages", icon: <MessageSquare className="w-5 h-5" /> },
          { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-5 h-5" /> },
        ];
    }
  })();

  const roleLabel = primaryRole === "service_provider" ? "Service Provider" : primaryRole.charAt(0).toUpperCase() + primaryRole.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">EstatesRW</span>
            </Link>
            <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || user?.email}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{roleLabel}</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button onClick={handleSignOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center gap-4">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-display text-lg font-semibold text-foreground">
            {navItems.find((i) => i.href === location.pathname)?.label || "Dashboard"}
          </h1>
        </header>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
