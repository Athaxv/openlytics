"use client";

import { Star } from "lucide-react";
import { useToggleFavorite } from "@/hooks/use-toggle-favorite";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  problemId: string;
  favorite: boolean;
  size?: number;
  className?: string;
  onFavoriteChange?: (favorite: boolean) => void;
};

export function FavoriteButton({
  problemId,
  favorite,
  size = 14,
  className,
  onFavoriteChange,
}: FavoriteButtonProps) {
  const { mutate, isPending } = useToggleFavorite();

  return (
    <button
      type="button"
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorite}
      disabled={isPending}
      onClick={(event) => {
        event.stopPropagation();
        const nextFavorite = !favorite;
        onFavoriteChange?.(nextFavorite);
        mutate(
          { problemId, favorite },
          {
            onError: () => onFavoriteChange?.(favorite),
          },
        );
      }}
      className={cn(
        "rounded-sm transition-colors hover:text-amber-400 disabled:opacity-50",
        className,
      )}
    >
      <Star
        size={size}
        className={cn(
          favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
        )}
      />
    </button>
  );
}
