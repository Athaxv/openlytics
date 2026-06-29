import { cn } from "@/lib/utils";

type MarketingSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
};

export function MarketingSectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: MarketingSectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "max-w-2xl",
        isCenter ? "mx-auto text-center" : "text-center md:mx-0 md:text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className={cn("text-3xl md:text-4xl", eyebrow && "mt-2")}>{title}</h2>
      {description ? (
        <p className="mt-3 text-base text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
