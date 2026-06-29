import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const topicColors: Record<string, string> = {
  Array: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  String: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Hash Table": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Dynamic Programming": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Graph: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Tree: "bg-lime-500/10 text-lime-400 border-lime-500/20",
  "Binary Search": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Two Pointers": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Stack: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Greedy: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

type TopicChipProps = {
  topic: string;
  className?: string;
};

export function TopicChip({ topic, className }: TopicChipProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-normal",
        topicColors[topic] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {topic}
    </Badge>
  );
}
