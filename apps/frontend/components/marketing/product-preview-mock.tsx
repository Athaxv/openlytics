import { cn } from "@/lib/utils";

const CONTRIBUTION_PATTERN = [
  [0, 1, 2, 1, 3, 2, 4],
  [1, 2, 3, 4, 2, 3, 1],
  [0, 1, 1, 2, 3, 4, 2],
  [2, 3, 4, 3, 2, 1, 0],
  [1, 2, 2, 3, 4, 3, 2],
];

const LEVEL_CLASSES: Record<number, string> = {
  0: "border border-border/50 bg-muted",
  1: "bg-emerald-950",
  2: "bg-emerald-900",
  3: "bg-emerald-700",
  4: "bg-emerald-500",
};

const STATS = [
  { label: "Problems", value: "247" },
  { label: "Streak", value: "12d" },
  { label: "CF Rating", value: "1,642" },
];

const SPARKLINE = [28, 32, 30, 35, 38, 36, 42];

type ProductPreviewMockProps = {
  className?: string;
  size?: "default" | "large";
};

export function ProductPreviewMock({
  className,
  size = "default",
}: ProductPreviewMockProps) {
  const isLarge = size === "large";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-xl backdrop-blur-sm",
        isLarge ? "p-6" : "p-4",
        className,
      )}
      aria-hidden
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dashboard
          </p>
          <p className="mt-1 text-sm text-foreground">Your coding activity</p>
        </div>
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-muted-foreground/30" />
          <span className="size-2 rounded-full bg-primary" />
        </div>
      </div>

      <div className={cn("grid gap-3", isLarge ? "grid-cols-3" : "grid-cols-3")}>
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/60 bg-background/60 p-3"
          >
            <p className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-3">
        <p className="mb-3 text-xs text-muted-foreground">Contribution</p>
        <div className="flex gap-1">
          {CONTRIBUTION_PATTERN.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((level, dayIndex) => (
                <span
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "rounded-sm",
                    isLarge ? "size-3" : "size-2.5",
                    LEVEL_CLASSES[level],
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/60 bg-background/60 p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">CF Rating trend</p>
          <p className="text-xs font-medium text-primary">+48</p>
        </div>
        <div className="flex h-12 items-end gap-1">
          {SPARKLINE.map((value, index) => (
            <span
              key={index}
              className="flex-1 rounded-sm bg-primary/80"
              style={{ height: `${(value / 42) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
