import { subDays, formatISO } from "date-fns";
import { EMPTY_CODEFORCES_RATING } from "@/lib/integrations/codeforces-rating";
import type { DashboardData } from "@/types/dashboard";
import { problemsMock } from "@/mock/problems";

function buildMockContribution() {
  return Array.from({ length: 365 }, (_, index) => ({
    date: formatISO(subDays(new Date(), 364 - index), { representation: "date" }),
    count: (index * 3) % 5,
  }));
}

export const dashboardMock: DashboardData = {
  stats: [
    { title: "Total Problems", value: "486", delta: "12 this week", positive: true },
    { title: "Daily Streak", value: "19 days", delta: "Keep the momentum going", positive: true },
    { title: "This Week", value: "12", delta: "+3 vs last week", positive: true },
    { title: "CF Rating", value: "1842", delta: "+57 last contest", positive: true },
  ],
  problemsContribution: buildMockContribution(),
  codeforcesRating: {
    ...EMPTY_CODEFORCES_RATING,
    currentRating: 1842,
    maxRating: 1920,
    rank: "expert",
    history: Array.from({ length: 12 }, (_, index) => ({
      date: formatISO(subDays(new Date(), (11 - index) * 14), { representation: "date" }),
      rating: 1620 + index * 20,
      oldRating: 1600 + index * 20,
      delta: 20,
      contestName: `Codeforces Round #${1000 + index}`,
    })),
  },
  problems: problemsMock,
  totalProblems: problemsMock.length,
};
