"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUIStore } from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types/app-user";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]}${parts[parts.length - 1]![0]}`.toUpperCase();
}

type SidebarProfileProps = {
  user: AppUser;
  expanded: boolean;
};

function UserAvatar({ user, size = "md" }: { user: AppUser; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";

  if (user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name}
        className={cn("shrink-0 rounded-full object-cover", dim)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground",
        dim,
      )}
    >
      {getInitials(user.name)}
    </div>
  );
}

export function SidebarProfile({ user, expanded }: SidebarProfileProps) {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  if (!expanded) {
    return (
      <div className="flex flex-col items-center gap-2 p-2">
        <UserAvatar user={user} size="sm" />
        <ThemeToggle className="rounded-full" />
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation menu"
        >
          <Menu size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-3">
      <UserAvatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle className="rounded-full" />
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Open navigation menu"
        >
          <Menu size={16} />
        </Button>
      </div>
    </div>
  );
}
