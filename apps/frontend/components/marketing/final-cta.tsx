import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingImageBackground } from "@/components/marketing/marketing-image-background";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative min-h-[320px] overflow-hidden md:min-h-[400px]">
      <MarketingImageBackground src="/hero3.png" gridOpacity="opacity-[0.03]" />

      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/90" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[320px] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center md:min-h-[400px] md:py-20">
        <h2 className="text-3xl md:text-4xl">Start building consistency today</h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
          Create a free account, connect your platforms, and see your practice in one place.
        </p>
        <Button
          size="lg"
          className="mt-8 h-11 rounded-full px-6"
          render={<Link href="/sign-up" />}
        >
          Get started free
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}
