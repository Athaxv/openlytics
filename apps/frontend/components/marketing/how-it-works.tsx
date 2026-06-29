import { MarketingSectionHeader } from "@/components/marketing/marketing-section-header";
import { howItWorksSteps } from "@/lib/marketing/content";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-16 md:py-24">
      <MarketingSectionHeader
        title="How it works"
        description="Three steps from scattered practice to a clear, repeatable system."
      />

      <ol className="mt-12 md:flex md:divide-x md:divide-border/50">
        {howItWorksSteps.map((step, index) => (
          <li
            key={step.title}
            className={cn(
              "flex-1 py-6 md:px-8 md:py-0",
              index === 0 && "md:pl-0",
              index === howItWorksSteps.length - 1 && "md:pr-0",
              index > 0 && "border-t border-border/50 md:border-t-0",
            )}
          >
            <span
              className="text-4xl font-light tabular-nums text-primary/80 md:text-5xl"
              aria-hidden
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-xl">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
