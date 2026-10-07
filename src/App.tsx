import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";
import ImpersonationBanner from "@/components/dashboard/ImpersonationBanner";
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
import CookiePolicy from "./pages/CookiePolicy";
import AboutUs from "./pages/AboutUs";
import OurWork from "./pages/OurWork";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PublicListings from "./pages/PublicListings";
import ListingDetail from "./pages/ListingDetail";

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
import AdSenseCompliance from "./pages/dashboard/admin/AdSenseCompliance";
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
import ManageOverview from "./pages/manage/ManageOverview";
import OccupancyMap from "./pages/manage/OccupancyMap";
import AccessControlPage from "./pages/manage/AccessControlPage";
import MyHomePage from "./pages/manage/MyHomePage";
import LeasesPage from "./pages/manage/LeasesPage";
import RentCollectionPage from "./pages/manage/RentCollectionPage";
import UnitsTablePage from "./pages/manage/UnitsTablePage";
import PropertySetupPage from "./pages/manage/PropertySetupPage";
import ActivityLogPage from "./pages/manage/ActivityLogPage";
import ReportsPage from "./pages/manage/ReportsPage";
import ContractsPage from "./pages/manage/ContractsPage";

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
    <Route path="/cookie-policy" element={<CookiePolicy />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/our-work" element={<OurWork />} />
    <Route path="/services" element={<Services />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/houses-for-sale-kigali" element={<PublicListings type="sale" />} />
    <Route path="/houses-for-rent-kigali" element={<PublicListings type="rent" />} />
    <Route path="/listing/:id" element={<ListingDetail />} />
    <Route path="/property/:slug" element={<ListingDetail />} />
    

    {/* Property Management OS */}
    <Route path="/manage" element={<DashboardRoute><ManageOverview /></DashboardRoute>} />
    <Route path="/manage/occupancy" element={<DashboardRoute><OccupancyMap /></DashboardRoute>} />
    <Route path="/manage/access" element={<DashboardRoute><AccessControlPage /></DashboardRoute>} />
    <Route path="/manage/my-home" element={<DashboardRoute><MyHomePage /></DashboardRoute>} />
    <Route path="/manage/units" element={<DashboardRoute><UnitsTablePage /></DashboardRoute>} />
    <Route path="/manage/leases" element={<DashboardRoute><LeasesPage /></DashboardRoute>} />
    <Route path="/manage/rent" element={<DashboardRoute><RentCollectionPage /></DashboardRoute>} />
    <Route path="/manage/contracts" element={<DashboardRoute><ContractsPage /></DashboardRoute>} />
    <Route path="/manage/setup" element={<DashboardRoute><PropertySetupPage /></DashboardRoute>} />
    <Route path="/manage/activity" element={<DashboardRoute><ActivityLogPage /></DashboardRoute>} />
    <Route path="/manage/reports" element={<DashboardRoute><ReportsPage /></DashboardRoute>} />

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
    <Route path="/dashboard/admin/adsense-compliance" element={<DashboardRoute><AdSenseCompliance /></DashboardRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <HelmetProvider>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
              <ImpersonationBanner />
              <CookieConsent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
