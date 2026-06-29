import { StatSparkline } from "@/components/dashboard/stat-sparkline";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon?: LucideIcon;
  variant?: "default" | "featured";
  sparkline?: number[];
};

export function StatCard({
  title,
  value,
  delta,
  positive = true,
  icon: Icon,
  variant = "default",
  sparkline,
}: StatCardProps) {
  const featured = variant === "featured";

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 shadow-sm",
        featured
          ? "bg-primary text-primary-foreground"
          : "border-0 bg-card",
      )}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm",
              featured ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          <p
            className={cn(
              "mt-2 text-xs",
              featured
                ? "text-primary-foreground/70"
                : positive
                  ? "text-emerald-500"
                  : "text-rose-500",
            )}
          >
            {delta}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              featured
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      {sparkline && sparkline.length > 0 ? (
        <StatSparkline data={sparkline} featured={featured} />
      ) : null}
    </article>
  );
}
