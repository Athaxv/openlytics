import {
  BrainCircuit,
  ChartNoAxesCombined,
  Flame,
  LineChart,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";

export type MarketingFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
  featured?: boolean;
  bentoLayout?: "featured-visual" | "centered" | "stat" | "integrations";
};

export type MarketingStep = {
  title: string;
  description: string;
};

export type MarketingTestimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  category?: string;
};

export type ProductHighlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
] as const;

export const features: MarketingFeature[] = [
  {
    title: "Unified DSA Tracking",
    description:
      "Track your LeetCode, Codeforces, and interview prep in one place — no more tab-hopping between platforms.",
    icon: ChartNoAxesCombined,
    featured: true,
    bentoLayout: "featured-visual",
  },
  {
    title: "AI Personal Coach",
    description:
      "Get practical recommendations based on your weak topics and recurring patterns.",
    icon: BrainCircuit,
    bentoLayout: "centered",
  },
  {
    title: "Consistency Engine",
    description:
      "Visual streaks, session logs, and accountability loops that keep you sharp.",
    icon: Flame,
    bentoLayout: "stat",
  },
  {
    title: "Session Intelligence",
    description:
      "Understand where your time goes and how productive each study session is.",
    icon: Timer,
    bentoLayout: "stat",
  },
];

export const productHighlights: ProductHighlight[] = [
  {
    title: "Contribution heatmap",
    description: "See your solve cadence at a glance across weeks and months.",
    icon: Sparkles,
  },
  {
    title: "Codeforces rating chart",
    description: "Track contest rating trends alongside daily practice volume.",
    icon: LineChart,
  },
  {
    title: "Daily problem history",
    description: "Browse what you solved today — or any previous day.",
    icon: ChartNoAxesCombined,
  },
];

export const howItWorksSteps: MarketingStep[] = [
  {
    title: "Connect",
    description: "Link your LeetCode and Codeforces handles. Openlytics syncs your solve history.",
  },
  {
    title: "Track",
    description: "Log study sessions, review daily solves, and watch your streaks build.",
  },
  {
    title: "Improve",
    description: "Spot topic gaps, stay consistent, and raise your contest rating over time.",
  },
];

export const testimonials: MarketingTestimonial[] = [
  {
    quote: "Clean analytics that finally make my practice feel measurable.",
    name: "Alex R.",
    role: "ICPC candidate",
    initials: "AR",
    category: "ICPC / COMPETITIVE",
  },
  {
    quote: "The consistency view alone changed how I show up every day.",
    name: "Priya M.",
    role: "SWE interview prep",
    initials: "PM",
    category: "INTERVIEW PREP",
  },
  {
    quote: "Feels like a coach watching my weak topics without being noisy.",
    name: "Jordan K.",
    role: "Competitive programmer",
    initials: "JK",
    category: "COMPETITIVE PROGRAMMING",
  },
];

export const platformStrip = {
  label: "Syncs with",
  platforms: [
    { id: "leetcode" as const, label: "LeetCode" },
    { id: "codeforces" as const, label: "Codeforces" },
  ],
} as const;

export const authBrandQuote = {
  quote: "Openlytics turned my scattered solves into a clear daily rhythm.",
  name: "Alex R.",
  role: "ICPC candidate",
};
