import Link from "next/link";
import { navLinks } from "@/lib/marketing/content";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: navLinks.map((link) => ({ label: link.label, href: link.href })),
  },
  {
    title: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
] as const;

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border/60">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] [background-size:3rem_3rem]"
        aria-hidden
      />

      <p
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[clamp(4rem,15vw,12rem)] font-semibold leading-none text-foreground/[0.04]"
        aria-hidden
      >
        Openlytics
      </p>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-2">
            <p className="text-lg font-semibold tracking-tight">Openlytics</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Built for serious DSA practice — track, analyze, and improve.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {column.title}
              </p>
              <nav className="mt-4 flex flex-col gap-3" aria-label={column.title}>
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="min-h-11 text-sm text-foreground/80 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-border/60 px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Openlytics — {year}</p>
          <p>Understand your coding journey. Improve with AI.</p>
        </div>
      </div>
    </footer>
  );
}
