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
  default: "bg-secondary text-primary",
  primary: "bg-primary text-primary-foreground",
  accent: "bg-accent/15 text-accent-foreground",
  success: "bg-success/10 text-success",
};

const StatsCard = ({ title, value, icon, description, trend, variant = "default" }: StatsCardProps) => (
  <div className="group bg-card rounded-3xl border border-border shadow-soft hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1.5 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/80">{title}</p>
        <p className="font-display text-3xl font-semibold text-foreground tabular-nums leading-none">{value}</p>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && (
          <div className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      <div className={`p-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-105 ${variantStyles[variant]}`}>{icon}</div>
    </div>
  </div>
);


export default StatsCard;