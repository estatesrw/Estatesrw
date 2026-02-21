import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
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
    <Route path="/blog" element={<Blog />} />
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
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
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
);

export default App;
