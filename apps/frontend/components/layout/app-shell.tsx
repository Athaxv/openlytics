"use client";

import { Menu } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/app-user";

type AppShellProps = {
  children: React.ReactNode;
  user: AppUser;
};

export function AppShell({ children, user }: AppShellProps) {
  const sidebarHoverOpen = useUIStore((state) => state.sidebarHoverOpen);
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  return (
    <div className="min-h-screen">
      <Sidebar user={user} />
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-out motion-reduce:transition-none",
          sidebarHoverOpen ? "lg:pl-64" : "lg:pl-16",
        )}
      >
        <main className="flex-1 bg-muted/40 p-4 sm:p-6">{children}</main>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-30 rounded-full shadow-md lg:hidden"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </Button>
    </div>
  );
}
