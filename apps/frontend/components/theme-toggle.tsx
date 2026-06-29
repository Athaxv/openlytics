"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-card-foreground hover:bg-muted",
        className,
      )}
      aria-label="Toggle theme"
    >
      {!mounted ? (
        <Moon size={16} className="opacity-0" aria-hidden />
      ) : isDark ? (
        <Sun size={16} />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}
