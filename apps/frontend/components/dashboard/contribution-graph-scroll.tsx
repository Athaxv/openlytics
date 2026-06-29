"use client";

import { useEffect, useRef } from "react";
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@/lib/utils";

type ContributionGraphScrollProps = {
  children: React.ReactNode;
  className?: string;
  scrollKey?: string | number;
};

export function ContributionGraphScroll({
  children,
  className,
  scrollKey,
}: ContributionGraphScrollProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const scrollToEnd = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth;
      if (maxScroll <= 0) {
        return;
      }
      viewport.scrollTo({ left: maxScroll, behavior: "instant" });
    };

    scrollToEnd();
    requestAnimationFrame(scrollToEnd);

    const timeouts = [0, 50, 150].map((delay) =>
      window.setTimeout(scrollToEnd, delay),
    );

    const observer = new ResizeObserver(scrollToEnd);
    observer.observe(viewport);

    const content = viewport.firstElementChild;
    if (content) {
      observer.observe(content);
    }

    return () => {
      timeouts.forEach(window.clearTimeout);
      observer.disconnect();
    };
  }, [scrollKey]);

  return (
    <div className={cn("contribution-scroll relative w-full", className)}>
      <ScrollAreaPrimitive.Root className="relative w-full overflow-hidden">
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          data-slot="scroll-area-viewport"
          className="w-full overflow-x-auto overflow-y-hidden pb-3 outline-none"
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollAreaPrimitive.Scrollbar
          orientation="horizontal"
          className="mt-2 flex h-1.5 touch-none select-none flex-col border-t border-transparent p-px transition-colors"
        >
          <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-muted-foreground/25 hover:bg-muted-foreground/40" />
        </ScrollAreaPrimitive.Scrollbar>
      </ScrollAreaPrimitive.Root>

      <div
        className="pointer-events-none absolute bottom-4 left-0 top-0 w-6 bg-gradient-to-r from-card to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-4 right-0 top-0 w-6 bg-gradient-to-l from-card to-transparent"
        aria-hidden
      />
    </div>
  );
}
