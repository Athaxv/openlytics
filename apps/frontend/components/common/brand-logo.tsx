import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  xs: "h-6",
  sm: "h-7",
  md: "h-8",
  lg: "h-9",
  xl: "h-10",
  "2xl": "h-12",
} as const;

type BrandLogoSize = keyof typeof SIZE_CLASS;

type BrandLogoProps = {
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = "md", className, priority }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Openlytics"
      width={160}
      height={40}
      priority={priority}
      className={cn("w-auto shrink-0 object-contain", SIZE_CLASS[size], className)}
    />
  );
}

type BrandLogoLinkProps = BrandLogoProps & {
  href?: string;
};

export function BrandLogoLink({
  href = "/",
  size = "md",
  className,
  priority,
}: BrandLogoLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <BrandLogo size={size} priority={priority} />
    </Link>
  );
}
