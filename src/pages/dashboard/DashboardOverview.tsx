import { useAuth } from "@/hooks/useAuth";
import TenantOverview from "@/components/dashboard/tenant/TenantOverview";
import LandlordOverview from "@/components/dashboard/landlord/LandlordOverview";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";
import VendorOverview from "@/pages/dashboard/vendor/VendorOverview";

const DashboardOverview = () => {
  const { roles } = useAuth();
  const primaryRole = roles[0] || "tenant";

  switch (primaryRole) {
    case "landlord":
      return <LandlordOverview />;
    case "admin":
      return <AdminOverview />;
    case "vendor":
      return <VendorOverview />;
    default:
      return <TenantOverview />;
  }
};

export default DashboardOverview;
