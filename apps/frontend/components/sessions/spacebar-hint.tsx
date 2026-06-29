"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { TimerStatus } from "@/lib/stores/timer-store";
import { cn } from "@/lib/utils";

type SpacebarHintProps = {
  status: TimerStatus;
  pressed: boolean;
};

function getHintText(status: TimerStatus) {
  if (status === "idle") return "to start";
  if (status === "running") return "to stop";
  return "to resume";
}

export function SpacebarHint({ status, pressed }: SpacebarHintProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="mt-10 flex flex-col items-center gap-2"
      aria-label={`Press spacebar ${getHintText(status)}`}
    >
      <motion.kbd
        animate={
          pressed && !reducedMotion
            ? { scale: 0.95 }
            : { scale: 1 }
        }
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "inline-flex min-h-11 min-w-44 items-center justify-center rounded-xl border border-border/80 bg-background/80 px-8 py-3 font-mono text-sm font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          pressed && "ring-2 ring-primary/50",
        )}
      >
        Space
      </motion.kbd>
      <p className="text-sm text-muted-foreground">{getHintText(status)}</p>
    </div>
  );
}
