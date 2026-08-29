import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import TenantOverview from "@/components/dashboard/tenant/TenantOverview";
import LandlordOverview from "@/components/dashboard/landlord/LandlordOverview";
import VendorOverview from "@/pages/dashboard/vendor/VendorOverview";
import AgentOverview from "@/pages/dashboard/agent/AgentOverview";

const DashboardOverview = () => {
  const { roles } = useAuth();
  const primaryRole = roles[0] || "tenant";

  switch (primaryRole) {
    case "landlord":
      return <LandlordOverview />;
    case "admin":
      return <Navigate to="/manage" replace />;
    case "vendor":
      return <VendorOverview />;
    case "agent":
      return <AgentOverview />;
    default:
      return <TenantOverview />;
  }
};

export default DashboardOverview;
