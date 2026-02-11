import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: string; positive: boolean };
}

const StatsCard = ({ title, value, icon, description, trend }: StatsCardProps) => (
  <Card className="shadow-card">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground font-display">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {trend && (
            <p className={`text-xs font-medium ${trend.positive ? "text-primary" : "text-destructive"}`}>
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;
