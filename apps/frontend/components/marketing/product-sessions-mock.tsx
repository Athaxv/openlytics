import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";

const SESSIONS = [
  { status: "Completed", problem: "Two Sum", platform: "LeetCode", time: "32m", selected: false },
  { status: "Completed", problem: "Graph Paths", platform: "Codeforces", time: "48m", selected: true },
  { status: "Active", problem: "Binary Search", platform: "LeetCode", time: "18m", selected: true },
  { status: "Paused", problem: "Segment Tree", platform: "Codeforces", time: "55m", selected: false },
] as const;

const STATUS_STYLES: Record<string, string> = {
  Completed: "text-primary",
  Active: "text-foreground",
  Paused: "text-muted-foreground",
};

type ProductSessionsMockProps = {
  className?: string;
};

export function ProductSessionsMock({ className }: ProductSessionsMockProps) {
  const selectedCount = SESSIONS.filter((s) => s.selected).length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-xl",
        className,
      )}
      aria-hidden
    >
      <div className="border-b border-border/60 px-5 py-4">
        <p className="text-sm font-medium text-foreground">Study sessions</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Review your recent practice.</p>
      </div>

      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-3">
        <div className="flex-1 rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground">
          Filter sessions...
        </div>
        <button
          type="button"
          className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-xs text-muted-foreground"
          tabIndex={-1}
        >
          Columns
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs text-muted-foreground">
              <th className="w-10 px-5 py-3 font-medium" />
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium">Problem</th>
              <th className="px-3 py-3 font-medium">Platform</th>
              <th className="px-3 py-3 font-medium">Time</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((session) => (
              <tr
                key={session.problem}
                className={cn(
                  "border-b border-border/40 last:border-0",
                  session.selected && "bg-muted/40",
                )}
              >
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex size-4 items-center justify-center rounded border border-border/80",
                      session.selected && "border-primary bg-primary",
                    )}
                  >
                    {session.selected ? (
                      <span className="size-2 rounded-sm bg-primary-foreground" />
                    ) : null}
                  </span>
                </td>
                <td className={cn("px-3 py-3 text-xs", STATUS_STYLES[session.status])}>
                  {session.status}
                </td>
                <td className="px-3 py-3 text-foreground">{session.problem}</td>
                <td className="px-3 py-3 text-muted-foreground">{session.platform}</td>
                <td className="px-3 py-3 tabular-nums text-muted-foreground">{session.time}</td>
                <td className="px-3 py-3 text-muted-foreground">
                  <MoreHorizontal className="size-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
        <span>
          {selectedCount} of {SESSIONS.length} session(s) selected.
        </span>
        <div className="flex gap-3">
          <span>Previous</span>
          <span>Next</span>
        </div>
      </div>
    </div>
  );
}
