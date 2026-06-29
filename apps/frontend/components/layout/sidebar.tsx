"use client";

import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarProfile } from "@/components/layout/sidebar-profile";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/app-user";

type SidebarProps = {
  user: AppUser;
};

export function Sidebar({ user }: SidebarProps) {
  const { sidebarHoverOpen, mobileNavOpen, setSidebarHoverOpen, setMobileNavOpen } =
    useUIStore();
  const sidebarRef = useRef<HTMLElement>(null);

  const expanded = sidebarHoverOpen;

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && sidebarRef.current?.contains(next)) {
      return;
    }
    setSidebarHoverOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-y-0 left-0 z-30 hidden w-2 lg:block"
        onMouseEnter={() => setSidebarHoverOpen(true)}
        aria-hidden
      />

      <aside
        ref={sidebarRef}
        onMouseEnter={() => setSidebarHoverOpen(true)}
        onMouseLeave={() => setSidebarHoverOpen(false)}
        onFocus={() => setSidebarHoverOpen(true)}
        onBlur={handleBlur}
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden h-screen flex-col bg-card motion-reduce:transition-none lg:flex",
          "transition-[width,box-shadow] duration-300 ease-out",
          expanded
            ? "w-64 border-r border-border/60 shadow-xl shadow-black/10"
            : "w-16 border-r border-border/40",
        )}
      >
        <div className={cn("shrink-0 p-4", !expanded && "px-2")}>
          {expanded ? (
            <>
              <h1 className="text-xl font-semibold tracking-tight">Openlytics</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                DSA Analytics + AI Coach
              </p>
            </>
          ) : (
            <div className="flex justify-center">
              <span className="text-lg font-semibold">O</span>
            </div>
          )}
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-2 py-4">
          <SidebarNav collapsed={!expanded} />
        </ScrollArea>

        <Separator />
        <div className="shrink-0">
          <SidebarProfile user={user} expanded={expanded} />
        </div>
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="flex w-64 flex-col p-0">
          <SheetHeader className="border-b border-border p-4 text-left">
            <SheetTitle>Openlytics</SheetTitle>
            <p className="text-sm text-muted-foreground">DSA Analytics + AI Coach</p>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </div>
          <Separator />
          <SidebarProfile user={user} expanded />
        </SheetContent>
      </Sheet>
    </>
  );
}
