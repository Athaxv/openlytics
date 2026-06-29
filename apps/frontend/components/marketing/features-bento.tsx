import { PlatformLogo } from "@/components/common/platform-logo";
import { MarketingSectionHeader } from "@/components/marketing/marketing-section-header";
import { ProductPreviewMock } from "@/components/marketing/product-preview-mock";
import { features, platformStrip } from "@/lib/marketing/content";
import { cn } from "@/lib/utils";
import { BrainCircuit, Flame, Timer } from "lucide-react";
import type { ReactNode } from "react";

function BentoCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 transition-colors motion-safe:duration-200 motion-reduce:transition-none hover:border-primary/20 md:p-8",
        className,
      )}
    >
      {children}
    </article>
  );
}

function InsightChipMock() {
  return (
    <div className="mt-8 flex flex-col items-center gap-3" aria-hidden>
      <div className="rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
        Weak topic: Dynamic Programming
      </div>
      <div className="w-full max-w-xs rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm text-foreground">
        Practice 2 medium DP problems this week
      </div>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Flame;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border/60 bg-background/50 p-4 text-center">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden />
      </div>
      <p className="mt-3 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function FeaturesBento() {
  const featured = features.find((f) => f.bentoLayout === "featured-visual") ?? features[0];
  const aiCoach = features.find((f) => f.title === "AI Personal Coach");
  const consistency = features.find((f) => f.title === "Consistency Engine");
  const session = features.find((f) => f.title === "Session Intelligence");

  return (
    <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-16 md:py-24">
      <MarketingSectionHeader
        title="Everything you need to practice smarter"
        description="One workspace for tracking solves, sessions, and the habits that compound over time."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        {/* Featured — large left cell */}
        <BentoCard className="flex flex-col lg:col-span-1 lg:row-span-2">
          <div className="relative z-10">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {featured?.icon ? <featured.icon className="size-5" aria-hidden /> : null}
            </div>
            <h3 className="mt-5 text-2xl">{featured?.title}</h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
              {featured?.description}
            </p>
          </div>
          <div className="relative mt-6 flex-1 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]">
            <ProductPreviewMock className="opacity-50" />
          </div>
        </BentoCard>

        {/* AI Coach — top right */}
        <BentoCard className="flex flex-col items-center text-center lg:col-span-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BrainCircuit className="size-5" aria-hidden />
          </div>
          <h3 className="mt-4 text-xl md:text-2xl">{aiCoach?.title}</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{aiCoach?.description}</p>
          <InsightChipMock />
        </BentoCard>

        {/* Bottom right — stats + integrations */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
          <BentoCard className="sm:col-span-1">
            <h3 className="text-lg">{consistency?.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{consistency?.description}</p>
            <div className="mt-4">
              <StatTile icon={Flame} label="Current streak" value="12d" />
            </div>
          </BentoCard>

          <BentoCard className="sm:col-span-1">
            <h3 className="text-lg">{session?.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{session?.description}</p>
            <div className="mt-4">
              <StatTile icon={Timer} label="Today" value="45m" />
            </div>
          </BentoCard>

          <BentoCard className="flex flex-col justify-center sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {platformStrip.label}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {platformStrip.platforms.map((platform) => (
                <span
                  key={platform.id}
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/60 px-3 py-2 text-sm text-foreground"
                >
                  <PlatformLogo platform={platform.id} className="size-4" />
                  {platform.label}
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
