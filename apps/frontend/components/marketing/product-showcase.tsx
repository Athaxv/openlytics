import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingSectionHeader } from "@/components/marketing/marketing-section-header";
import { ProductSessionsMock } from "@/components/marketing/product-sessions-mock";
import { Button } from "@/components/ui/button";
import { productHighlights } from "@/lib/marketing/content";

export function ProductShowcase() {
  return (
    <section
      id="product"
      className="scroll-mt-28 border-t border-border/40 py-16 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <MarketingSectionHeader
            title="Your dashboard, decoded"
            description="Charts, streak heatmaps, and daily solve history — designed to show progress at a glance without drowning you in numbers."
          />

          <ul className="mt-10 divide-y divide-border/50 border-y border-border/50">
            {productHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex gap-4 py-5 first:pt-5 last:pb-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <Button className="mt-8" render={<Link href="/sign-in" />}>
            Sign in to explore
            <ArrowRight />
          </Button>
        </div>

        <div>
          <ProductSessionsMock />
        </div>
      </div>
    </section>
  );
}
