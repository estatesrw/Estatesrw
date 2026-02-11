import { useAuth } from "@/hooks/useAuth";
import TenantOverview from "@/components/dashboard/tenant/TenantOverview";
import LandlordOverview from "@/components/dashboard/landlord/LandlordOverview";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";

const DashboardOverview = () => {
  const { roles } = useAuth();
  const primaryRole = roles[0] || "tenant";

  switch (primaryRole) {
    case "landlord":
      return <LandlordOverview />;
    case "admin":
      return <AdminOverview />;
    default:
      return <TenantOverview />;
  }
};

export default DashboardOverview;
