import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import PropertiesPage from "./pages/dashboard/PropertiesPage";
import ApplicationsPage from "./pages/dashboard/ApplicationsPage";
import BookingsPage from "./pages/dashboard/BookingsPage";
import MaintenancePage from "./pages/dashboard/MaintenancePage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";
import BrowseProperties from "./pages/dashboard/BrowseProperties";
import UsersPage from "./pages/dashboard/UsersPage";
import ServicesPage from "./pages/dashboard/ServicesPage";
import BrowseServicesPage from "./pages/dashboard/BrowseServicesPage";
import ServiceBookingsPage from "./pages/dashboard/ServiceBookingsPage";
import PropertyDetailsPage from "./pages/dashboard/PropertyDetailsPage";
import BlogManagementPage from "./pages/dashboard/BlogManagementPage";
import AdsManagementPage from "./pages/dashboard/AdsManagementPage";
import VendorRegister from "./pages/dashboard/vendor/VendorRegister";
import VendorProperties from "./pages/dashboard/vendor/VendorProperties";
import VendorRoomTypes from "./pages/dashboard/vendor/VendorRoomTypes";
import VendorBookings from "./pages/dashboard/vendor/VendorBookings";
import VendorCalendar from "./pages/dashboard/vendor/VendorCalendar";
import VendorRevenue from "./pages/dashboard/vendor/VendorRevenue";
import VendorGuests from "./pages/dashboard/vendor/VendorGuests";
import VendorChannels from "./pages/dashboard/vendor/VendorChannels";
import VendorManagement from "./pages/dashboard/admin/VendorManagement";
import PlatformAnalytics from "./pages/dashboard/admin/PlatformAnalytics";
import CommissionManagement from "./pages/dashboard/admin/CommissionManagement";
import AdminBookingsPage from "./pages/dashboard/admin/AdminBookingsPage";
import AdminAgents from "./pages/dashboard/admin/AdminAgents";
import AgentReferrals from "./pages/dashboard/agent/AgentReferrals";
import AgentCommissions from "./pages/dashboard/agent/AgentCommissions";
import BrowseAccommodationPage from "./pages/dashboard/BrowseAccommodationPage";
import GuestBookingsPage from "./pages/dashboard/GuestBookingsPage";
import SavedPropertiesPage from "./pages/dashboard/SavedPropertiesPage";
import GuestPaymentHistoryPage from "./pages/dashboard/GuestPaymentHistoryPage";
import WithdrawalsPage from "./pages/dashboard/WithdrawalsPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute><DashboardLayout>{children}</DashboardLayout></ProtectedRoute>
);

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    <Route path="/disclaimer" element={<Disclaimer />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/services" element={<Services />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />

    {/* Dashboard - Shared */}
    <Route path="/dashboard" element={<DashboardRoute><DashboardOverview /></DashboardRoute>} />
    <Route path="/dashboard/messages" element={<DashboardRoute><MessagesPage /></DashboardRoute>} />
    <Route path="/dashboard/withdrawals" element={<DashboardRoute><WithdrawalsPage /></DashboardRoute>} />

    {/* Marketplace / Browse */}
    <Route path="/dashboard/browse" element={<DashboardRoute><BrowseProperties /></DashboardRoute>} />
    <Route path="/dashboard/property/:id" element={<DashboardRoute><PropertyDetailsPage /></DashboardRoute>} />
    <Route path="/dashboard/browse-services" element={<DashboardRoute><BrowseServicesPage /></DashboardRoute>} />

    {/* Guest */}
    <Route path="/dashboard/accommodation" element={<DashboardRoute><BrowseAccommodationPage /></DashboardRoute>} />
    <Route path="/dashboard/guest-bookings" element={<DashboardRoute><GuestBookingsPage /></DashboardRoute>} />
    <Route path="/dashboard/saved" element={<DashboardRoute><SavedPropertiesPage /></DashboardRoute>} />
    <Route path="/dashboard/guest-payments" element={<DashboardRoute><GuestPaymentHistoryPage /></DashboardRoute>} />
    <Route path="/dashboard/service-bookings" element={<DashboardRoute><ServiceBookingsPage /></DashboardRoute>} />

    {/* Landlord */}
    <Route path="/dashboard/properties" element={<DashboardRoute><PropertiesPage /></DashboardRoute>} />
    <Route path="/dashboard/applications" element={<DashboardRoute><ApplicationsPage /></DashboardRoute>} />
    <Route path="/dashboard/bookings" element={<DashboardRoute><BookingsPage /></DashboardRoute>} />
    <Route path="/dashboard/maintenance" element={<DashboardRoute><MaintenancePage /></DashboardRoute>} />
    <Route path="/dashboard/payments" element={<DashboardRoute><PaymentsPage /></DashboardRoute>} />

    {/* Vendor */}
    <Route path="/dashboard/vendor/register" element={<DashboardRoute><VendorRegister /></DashboardRoute>} />
    <Route path="/dashboard/vendor/properties" element={<DashboardRoute><VendorProperties /></DashboardRoute>} />
    <Route path="/dashboard/vendor/rooms" element={<DashboardRoute><VendorRoomTypes /></DashboardRoute>} />
    <Route path="/dashboard/vendor/bookings" element={<DashboardRoute><VendorBookings /></DashboardRoute>} />
    <Route path="/dashboard/vendor/calendar" element={<DashboardRoute><VendorCalendar /></DashboardRoute>} />
    <Route path="/dashboard/vendor/revenue" element={<DashboardRoute><VendorRevenue /></DashboardRoute>} />
    <Route path="/dashboard/vendor/guests" element={<DashboardRoute><VendorGuests /></DashboardRoute>} />
    <Route path="/dashboard/vendor/channels" element={<DashboardRoute><VendorChannels /></DashboardRoute>} />

    {/* Agent */}
    <Route path="/dashboard/agent/referrals" element={<DashboardRoute><AgentReferrals /></DashboardRoute>} />
    <Route path="/dashboard/agent/commissions" element={<DashboardRoute><AgentCommissions /></DashboardRoute>} />

    {/* Admin */}
    <Route path="/dashboard/users" element={<DashboardRoute><UsersPage /></DashboardRoute>} />
    <Route path="/dashboard/services" element={<DashboardRoute><ServicesPage /></DashboardRoute>} />
    <Route path="/dashboard/admin/vendors" element={<DashboardRoute><VendorManagement /></DashboardRoute>} />
    <Route path="/dashboard/admin/analytics" element={<DashboardRoute><PlatformAnalytics /></DashboardRoute>} />
    <Route path="/dashboard/admin/commissions" element={<DashboardRoute><CommissionManagement /></DashboardRoute>} />
    <Route path="/dashboard/admin/bookings" element={<DashboardRoute><AdminBookingsPage /></DashboardRoute>} />
    <Route path="/dashboard/admin/agents" element={<DashboardRoute><AdminAgents /></DashboardRoute>} />
    <Route path="/dashboard/blog" element={<DashboardRoute><BlogManagementPage /></DashboardRoute>} />
    <Route path="/dashboard/ads" element={<DashboardRoute><AdsManagementPage /></DashboardRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
