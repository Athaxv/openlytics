"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  CalendarCheck2,
  Flag,
  Gauge,
  Home,
  ListChecks,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/problems", label: "Problems", icon: ListChecks },
  { href: "/sessions", label: "Sessions", icon: CalendarCheck2 },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/coach", label: "AI Coach", icon: Bot },
  { href: "/roadmap", label: "Roadmap", icon: Target },
  { href: "/contests", label: "Contests", icon: Flag },
  { href: "/streak", label: "Streak", icon: Gauge },
  { href: "/settings", label: "Settings", icon: Settings },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SidebarNavProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = isActiveRoute(pathname, item.href);
        const Icon = item.icon;

        const linkClassName = cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        );

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger
                render={
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={linkClassName}
                  />
                }
              >
                <Icon size={16} className="shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={linkClassName}
          >
            <Icon size={16} className="shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
