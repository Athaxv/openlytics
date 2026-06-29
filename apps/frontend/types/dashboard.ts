import type { Problem } from "@/types/problems";

export type StatCardData = {
  title: string;
  value: string;
  delta: string;
  positive?: boolean;
};

export type ContributionDay = {
  date: string;
  count: number;
};

export type RatingPoint = {
  date: string;
  rating: number;
  oldRating: number;
  delta: number;
  contestName: string;
};

export type CodeforcesRatingSummary = {
  currentRating: number | null;
  maxRating: number | null;
  rank: string | null;
  history: RatingPoint[];
};

export type DashboardData = {
  stats: StatCardData[];
  problemsContribution: ContributionDay[];
  codeforcesRating: CodeforcesRatingSummary;
  problems: Problem[];
  totalProblems: number;
};
