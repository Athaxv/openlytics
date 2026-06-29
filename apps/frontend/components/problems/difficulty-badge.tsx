import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/problems";

const difficultyStyles: Record<Difficulty, string> = {
  easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

type DifficultyBadgeProps = {
  difficulty: Difficulty;
  className?: string;
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-normal", difficultyStyles[difficulty], className)}
    >
      {difficulty}
    </Badge>
  );
}
