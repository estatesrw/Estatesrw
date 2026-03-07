import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
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
import VendorManagement from "./pages/dashboard/admin/VendorManagement";
import PlatformAnalytics from "./pages/dashboard/admin/PlatformAnalytics";
import CommissionManagement from "./pages/dashboard/admin/CommissionManagement";
import AdminBookingsPage from "./pages/dashboard/admin/AdminBookingsPage";
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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/privacy" element={<PrivacyPolicy />} />
    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
    <Route path="/disclaimer" element={<Disclaimer />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardOverview /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/properties" element={<ProtectedRoute><DashboardLayout><PropertiesPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/browse" element={<ProtectedRoute><DashboardLayout><BrowseProperties /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/property/:id" element={<ProtectedRoute><DashboardLayout><PropertyDetailsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/applications" element={<ProtectedRoute><DashboardLayout><ApplicationsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/bookings" element={<ProtectedRoute><DashboardLayout><BookingsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/maintenance" element={<ProtectedRoute><DashboardLayout><MaintenancePage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/messages" element={<ProtectedRoute><DashboardLayout><MessagesPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/payments" element={<ProtectedRoute><DashboardLayout><PaymentsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/users" element={<ProtectedRoute><DashboardLayout><UsersPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/services" element={<ProtectedRoute><DashboardLayout><ServicesPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/browse-services" element={<ProtectedRoute><DashboardLayout><BrowseServicesPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/service-bookings" element={<ProtectedRoute><DashboardLayout><ServiceBookingsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/blog" element={<ProtectedRoute><DashboardLayout><BlogManagementPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/ads" element={<ProtectedRoute><DashboardLayout><AdsManagementPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/withdrawals" element={<ProtectedRoute><DashboardLayout><WithdrawalsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/register" element={<ProtectedRoute><DashboardLayout><VendorRegister /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/properties" element={<ProtectedRoute><DashboardLayout><VendorProperties /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/rooms" element={<ProtectedRoute><DashboardLayout><VendorRoomTypes /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/bookings" element={<ProtectedRoute><DashboardLayout><VendorBookings /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/calendar" element={<ProtectedRoute><DashboardLayout><VendorCalendar /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/revenue" element={<ProtectedRoute><DashboardLayout><VendorRevenue /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/vendor/guests" element={<ProtectedRoute><DashboardLayout><VendorGuests /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/admin/vendors" element={<ProtectedRoute><DashboardLayout><VendorManagement /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/admin/analytics" element={<ProtectedRoute><DashboardLayout><PlatformAnalytics /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/admin/commissions" element={<ProtectedRoute><DashboardLayout><CommissionManagement /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/admin/bookings" element={<ProtectedRoute><DashboardLayout><AdminBookingsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/guest-bookings" element={<ProtectedRoute><DashboardLayout><GuestBookingsPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/saved" element={<ProtectedRoute><DashboardLayout><SavedPropertiesPage /></DashboardLayout></ProtectedRoute>} />
    <Route path="/dashboard/guest-payments" element={<ProtectedRoute><DashboardLayout><GuestPaymentHistoryPage /></DashboardLayout></ProtectedRoute>} />
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
