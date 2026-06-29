import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingSectionHeader } from "@/components/marketing/marketing-section-header";
import { testimonials } from "@/lib/marketing/content";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="border-t border-border/40 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <MarketingSectionHeader
          title="What practitioners are saying"
          description="Early feedback from competitive programmers and interview-focused developers."
        />

        {featured ? (
          <article className="mt-12 grid gap-8 overflow-hidden rounded-2xl border border-border/60 bg-card/30 md:grid-cols-2 md:gap-0">
            <div className="flex flex-col justify-center p-8 md:p-10">
              {featured.category ? (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {featured.category}
                </p>
              ) : null}
              <blockquote className="mt-4 text-2xl leading-snug md:text-3xl">
                &ldquo;{featured.quote}&rdquo;
              </blockquote>
              <div className="mt-6">
                <p className="text-sm font-medium text-foreground">{featured.name}</p>
                <p className="text-sm text-muted-foreground">{featured.role}</p>
              </div>
              <Link
                href="/sign-up"
                className="mt-6 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground hover:text-primary"
              >
                See how they practice
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div
              className="flex min-h-[200px] items-center justify-center bg-muted/20 p-8 md:min-h-0"
              aria-hidden
            >
              <span className="flex size-32 items-center justify-center rounded-2xl border border-border/60 bg-background/40 text-4xl font-semibold text-primary/80">
                {featured.initials}
              </span>
            </div>
          </article>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((item) => (
            <article
              key={item.name}
              className={cn(
                "flex h-full flex-col rounded-2xl border border-border/60 bg-card/30 p-8",
              )}
            >
              {item.category ? (
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {item.category}
                </p>
              ) : null}
              <blockquote className="mt-4 flex-1 text-lg leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                  aria-hidden
                >
                  {item.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
