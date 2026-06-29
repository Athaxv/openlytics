import { cn } from "@/lib/utils";

type StatSparklineProps = {
  data: number[];
  featured?: boolean;
};

export function StatSparkline({ data, featured = false }: StatSparklineProps) {
  const max = Math.max(...data, 1);

  return (
    <div className="mt-4 flex h-10 items-end gap-0.5">
      {data.map((value, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 rounded-sm",
            featured ? "bg-primary-foreground/30" : "bg-primary/25",
          )}
          style={{
            height: `${Math.max((value / max) * 100, value > 0 ? 12 : 4)}%`,
            minHeight: value > 0 ? 4 : 2,
          }}
        />
      ))}
    </div>
  );
}
