import { PlatformLogo } from "@/components/common/platform-logo";
import { HeroBackground } from "@/components/marketing/hero-background";
import { HeroContent } from "@/components/marketing/hero-content";
import { HeroFloatingElements } from "@/components/marketing/hero-floating-elements";
import { platformStrip } from "@/lib/marketing/content";

export function MarketingHero() {
  return (
    <section className="relative flex h-dvh max-h-dvh w-full flex-col overflow-hidden">
      <HeroBackground />
      <HeroFloatingElements />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-20 pt-24 sm:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <HeroContent />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-border/30 bg-background/50 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-3 px-6 py-4 text-sm text-muted-foreground">
          <span>{platformStrip.label}</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {platformStrip.platforms.map((platform) => (
              <span
                key={platform.id}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-3 py-1.5 text-foreground"
              >
                <PlatformLogo platform={platform.id} className="size-4" />
                {platform.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
