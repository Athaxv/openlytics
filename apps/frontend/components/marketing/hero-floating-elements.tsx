"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Flame, Timer, TrendingUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingChip = {
  icon: LucideIcon;
  label: string;
  className: string;
  delay: number;
};

const chips: FloatingChip[] = [
  {
    icon: Flame,
    label: "12 day streak",
    className: "left-[6%] top-[22%] md:left-[8%] md:top-[24%]",
    delay: 0,
  },
  {
    icon: TrendingUp,
    label: "+48 CF",
    className: "right-[6%] top-[20%] md:right-[8%] md:top-[22%]",
    delay: 0.5,
  },
  {
    icon: CheckCircle2,
    label: "247 solved",
    className: "bottom-[18%] left-[5%] md:bottom-[16%] md:left-[7%]",
    delay: 1,
  },
  {
    icon: Timer,
    label: "45m today",
    className: "bottom-[16%] right-[5%] md:bottom-[14%] md:right-[7%]",
    delay: 1.5,
  },
];

function FloatingChipCard({
  chip,
  animate,
}: {
  chip: FloatingChip;
  animate: boolean;
}) {
  const Icon = chip.icon;

  const content = (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2 shadow-lg backdrop-blur-md">
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="text-xs font-medium text-foreground">{chip.label}</span>
    </div>
  );

  if (!animate) {
    return (
      <div className={cn("pointer-events-none absolute hidden md:block", chip.className)}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      className={cn("pointer-events-none absolute hidden md:block", chip.className)}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: chip.delay,
      }}
    >
      {content}
    </motion.div>
  );
}

export function HeroFloatingElements() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-1" aria-hidden>
      {chips.map((chip) => (
        <FloatingChipCard key={chip.label} chip={chip} animate={!reducedMotion} />
      ))}
    </div>
  );
}
