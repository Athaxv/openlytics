"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function HeroContent() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="w-full text-center"
      variants={reducedMotion ? undefined : container}
      initial={reducedMotion ? false : "hidden"}
      animate={reducedMotion ? undefined : "show"}
    >
      <motion.div variants={reducedMotion ? undefined : item}>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
          AI-powered DSA analytics
        </p>
      </motion.div>

      <motion.div variants={reducedMotion ? undefined : item}>
        <h1 className="mx-auto mt-5 max-w-3xl text-3xl leading-[1.15] tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
          Understand your coding journey.
          <span className="mt-2 block text-primary">Improve with AI.</span>
        </h1>
      </motion.div>

      <motion.div variants={reducedMotion ? undefined : item}>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">
          Openlytics turns your daily problem-solving data into actionable coaching so you
          can improve consistency, close topic gaps, and raise your contest rating.
        </p>
      </motion.div>

      <motion.div variants={reducedMotion ? undefined : item}>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            className="h-11 rounded-full border border-primary/30 bg-primary px-6 shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_35%,transparent)] transition-[box-shadow,transform] hover:bg-primary/90 hover:shadow-[0_0_32px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-safe:hover:scale-[1.02]"
            render={<Link href="/sign-up" />}
          >
            Get started free
            <ArrowRight className="transition-transform group-hover/button:translate-x-0.5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-11 rounded-full border-primary/25 bg-background/30 px-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-[border-color,background-color,transform] hover:border-primary/40 hover:bg-background/50 motion-safe:hover:scale-[1.02]"
            render={<a href="#product" />}
          >
            See how it works
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
