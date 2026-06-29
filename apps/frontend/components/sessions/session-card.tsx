import { format } from "date-fns";
import { Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StudySession } from "@/types/sessions";

type SessionCardProps = {
  session: StudySession;
};

export function SessionCard({ session }: SessionCardProps) {
  const start = new Date(session.startedAt);

  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium capitalize">{session.platform}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {format(start, "MMM d, yyyy · h:mm a")}
          </p>
        </div>
        <Badge variant="outline" className="gap-1 font-normal">
          <TrendingUp size={12} />
          {session.productivityScore}%
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={14} />
        <span>{session.durationMin} min</span>
        <span>·</span>
        <span>{session.problemsSolved.length} problems</span>
      </div>

      {session.problemsSolved.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {session.problemsSolved.map((problem) => (
            <Badge key={problem} variant="secondary" className="font-normal">
              {problem}
            </Badge>
          ))}
        </div>
      )}

      {session.notes && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{session.notes}</p>
      )}
    </article>
  );
}
