import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthDitherBackground } from "@/components/marketing/auth-dither-background";
import { ProductPreviewMock } from "@/components/marketing/product-preview-mock";
import { authBrandQuote } from "@/lib/marketing/content";

type MarketingAuthLayoutProps = {
  children: ReactNode;
  title: string;
  description: string;
};

export function MarketingAuthLayout({
  children,
  title,
  description,
}: MarketingAuthLayoutProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-r border-border/60 lg:flex lg:flex-col lg:p-10">
        <AuthDitherBackground />

        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <ArrowLeft className="size-4" aria-hidden />
              Back to home
            </Link>
            <p className="mt-10 text-3xl leading-tight">Practice with clarity.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Track solves, log sessions, and see the patterns that move your rating forward.
            </p>
          </div>

          <div className="space-y-6">
            <ProductPreviewMock />
            <figure className="rounded-2xl border border-border/80 bg-background/70 p-5 backdrop-blur-sm">
              <blockquote className="text-sm leading-relaxed text-foreground">
                &ldquo;{authBrandQuote.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">
                — {authBrandQuote.name}, {authBrandQuote.role}
              </figcaption>
            </figure>
          </div>
        </div>
      </aside>

      <main id="main-content" className="flex min-h-screen flex-col justify-center px-6 py-10">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 lg:hidden"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to home
          </Link>

          <div className="mt-6 lg:mt-0">
            <h1 className="text-3xl">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
