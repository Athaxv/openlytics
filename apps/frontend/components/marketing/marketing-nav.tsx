"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/marketing/content";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 48;

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out motion-reduce:transition-none",
        scrolled ? "px-4 pt-3 sm:px-8" : "px-4 pt-4 sm:px-6 sm:pt-5",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex items-center justify-between gap-3 border transition-all duration-500 ease-out motion-reduce:transition-none",
          scrolled
            ? "max-w-3xl min-h-11 rounded-full border-primary/20 bg-background/80 px-4 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.06)_inset] backdrop-blur-xl sm:px-5"
            : "w-full max-w-6xl min-h-[4.25rem] rounded-2xl border-transparent bg-transparent px-4 py-3.5 shadow-none backdrop-blur-none sm:px-6",
        )}
      >
        <Link
          href="/"
          className={cn(
            "shrink-0 font-semibold tracking-tight text-foreground transition-[font-size] duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            scrolled ? "text-sm sm:text-base" : "text-base sm:text-lg",
          )}
        >
          Openlytics
        </Link>

        <nav className={cn("hidden items-center md:flex", scrolled ? "gap-4" : "gap-5")} aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                scrolled ? "text-muted-foreground" : "text-foreground/90",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size={scrolled ? "sm" : "default"}
            className={cn(
              scrolled
                ? "border-border/70 bg-background/60"
                : "border-transparent bg-transparent shadow-none hover:bg-background/20",
            )}
            render={<Link href="/sign-in" />}
          >
            Sign in
          </Button>
          <Button size={scrolled ? "sm" : "default"} render={<Link href="/sign-up" />}>
            Get started
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-xl border text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden",
              scrolled
                ? "size-9 border-border/70 bg-background/70 hover:bg-muted"
                : "size-11 border-transparent bg-transparent shadow-none hover:bg-background/20",
            )}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="min-h-11 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 px-4 pb-4">
              <Button
                variant="outline"
                className="min-h-11 w-full"
                render={<Link href="/sign-in" onClick={() => setOpen(false)} />}
              >
                Sign in
              </Button>
              <Button
                className="min-h-11 w-full"
                render={<Link href="/sign-up" onClick={() => setOpen(false)} />}
              >
                Get started
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
