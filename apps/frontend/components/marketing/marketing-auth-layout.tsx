import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogoLink } from "@/components/common/brand-logo";
import { PlatformLogo } from "@/components/common/platform-logo";
import { MarketingImageBackground } from "@/components/marketing/marketing-image-background";
import { authBrandQuote, platformStrip } from "@/lib/marketing/content";

type MarketingAuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
  eyebrow?: string;
};

export function MarketingAuthLayout({
  children,
  title,
  description,
  eyebrow = "Welcome back",
}: MarketingAuthLayoutProps) {
  return (
    <div className="grid h-full overflow-hidden lg:grid-cols-2">
      <aside className="relative hidden h-full min-h-0 overflow-hidden lg:flex lg:flex-col">
        <MarketingImageBackground src="/hero3.png" priority={false} />

        <div
          className="absolute inset-0 bg-linear-to-r from-background/20 via-background/50 to-background/80"
          aria-hidden
        />

        <div className="relative z-10 flex h-full min-h-0 flex-col justify-between p-8 xl:p-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to home
            </Link>

            <p className="mt-8 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              AI-powered DSA analytics
            </p>
            <h2 className="mt-3 max-w-md text-3xl leading-tight xl:text-4xl">
              Understand your coding journey.
              <span className="mt-1 block text-primary">Improve with AI.</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Track solves, log sessions, and see the patterns that move your rating forward.
            </p>
          </div>

          <figure className="max-w-md rounded-2xl border border-border/40 bg-background/40 p-4 backdrop-blur-md xl:p-5">
            <blockquote className="text-sm leading-relaxed text-foreground">
              &ldquo;{authBrandQuote.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              — {authBrandQuote.name}, {authBrandQuote.role}
            </figcaption>
          </figure>
        </div>
      </aside>

      <main
        id="main-content"
        className="relative flex h-full min-h-0 flex-col overflow-hidden border-border/40 bg-background lg:border-l"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] [background-size:4rem_4rem]"
          aria-hidden
        />

        <div className="relative mx-auto flex h-full w-full max-w-md min-h-0 flex-col px-5 py-5 sm:px-6 sm:py-6 lg:justify-center lg:px-10 lg:py-8 xl:px-12">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>

          <header className="mt-4 shrink-0 lg:mt-0">
            <div className="flex items-center justify-between gap-3">
              <BrandLogoLink size="sm" />
              <span className="rounded-full border border-border/60 bg-card/40 px-2.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:px-3 sm:py-1 sm:text-[0.6875rem]">
                {eyebrow}
              </span>
            </div>
            <h1 className="mt-4 text-2xl sm:mt-5 sm:text-3xl lg:text-4xl">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </header>

          <div className="mt-4 min-h-0 flex-1 sm:mt-5 lg:flex-none">{children}</div>

          <div className="mt-4 flex shrink-0 flex-wrap items-center justify-center gap-1.5 border-t border-border/40 pt-4 sm:gap-2 sm:pt-5">
            <span className="text-[0.6875rem] text-muted-foreground sm:text-xs">
              {platformStrip.label}
            </span>
            {platformStrip.platforms.map((platform) => (
              <span
                key={platform.id}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-card/30 px-2 py-0.5 text-[0.6875rem] text-foreground sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs"
              >
                <PlatformLogo platform={platform.id} className="size-3 sm:size-3.5" />
                {platform.label}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
