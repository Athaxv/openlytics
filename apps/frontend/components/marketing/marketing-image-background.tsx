import Image from "next/image";
import { cn } from "@/lib/utils";

type MarketingImageBackgroundProps = {
  src: string;
  priority?: boolean;
  className?: string;
  gridOpacity?: string;
  topGradient?: boolean;
  bottomGradient?: boolean;
};

export function MarketingImageBackground({
  src,
  priority = false,
  className,
  gridOpacity = "opacity-[0.025]",
  topGradient = true,
  bottomGradient = true,
}: MarketingImageBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      {topGradient ? (
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/50 to-transparent" />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 [background-image:linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] [background-size:4rem_4rem]",
          gridOpacity,
        )}
      />

      {bottomGradient ? (
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      ) : null}
    </div>
  );
}
