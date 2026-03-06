import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "accent" | "success";
}

const variantStyles = {
  default: "bg-primary/8 text-primary",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
};

const StatsCard = ({ title, value, icon, description, trend, variant = "default" }: StatsCardProps) => (
  <div className="bg-card rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 p-5">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground font-sans tabular-nums">{value}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {trend && (
          <div className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>{icon}</div>
    </div>
  </div>
);

export default StatsCard;