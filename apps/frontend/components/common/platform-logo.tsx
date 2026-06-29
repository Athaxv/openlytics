import Image from "next/image";
import { cn } from "@/lib/utils";

export type PlatformLogoId = "leetcode" | "codeforces";

const LOGOS: Record<PlatformLogoId, { label: string; src: string }> = {
  leetcode: { label: "LeetCode", src: "/logos/leetcode.svg" },
  codeforces: { label: "Codeforces", src: "/logos/codeforces.svg" },
};

type PlatformLogoProps = {
  platform: PlatformLogoId;
  className?: string;
  size?: number;
};

export function PlatformLogo({ platform, className, size = 16 }: PlatformLogoProps) {
  const { label, src } = LOGOS[platform];

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}

export function getPlatformLabel(platform: PlatformLogoId) {
  return LOGOS[platform].label;
}
