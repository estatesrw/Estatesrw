import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PropertySwitcher from "@/components/manage/PropertySwitcher";
import { usePmProperties } from "@/hooks/usePmProperties";
import { useAuditLog } from "@/hooks/useLeases";
import { STATUS_LABELS } from "@/lib/unitStatus";
import { History } from "lucide-react";

const describe = (row: any) => {
  const from = row.old_value?.status;
  const to = row.new_value?.status;
  if (row.action === "unit_status_changed" && to) {
    const label = (s: string) => (STATUS_LABELS as any)[s] || s;
    return `Unit status changed${from ? ` from ${label(from)}` : ""} to ${label(to)}`;
  }
  return row.action.replace(/_/g, " ");
};

const ActivityLogPage = () => {
  const { properties, propertyId, setPropertyId } = usePmProperties();
  const { data: rows = [], isLoading } = useAuditLog(propertyId);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Activity Log | EstatesRW Management</title>
        <meta name="description" content="Full audit trail of unit, lease and contract activity across your properties." />
      </Helmet>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl">Activity log</h1>
          <p className="text-muted-foreground text-sm">Everything that changed, newest first.</p>
        </div>
        <PropertySwitcher properties={properties} propertyId={propertyId} onChange={setPropertyId} />
      </div>

      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
      ) : rows.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="py-16 text-center space-y-2">
            <History className="w-8 h-8 mx-auto text-muted-foreground" />
            <p className="font-serif text-xl">Nothing recorded yet</p>
            <p className="text-sm text-muted-foreground">Changes to units and tenancies will show up here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-3xl">
          <CardContent className="p-0 divide-y divide-border">
            {rows.map((row: any) => (
              <div key={row.id} className="flex items-start gap-4 p-4">
                <Badge variant="outline" className="rounded-full shrink-0">{row.entity_type}</Badge>
                <div className="min-w-0">
                  <p className="text-sm">{describe(row)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityLogPage;
