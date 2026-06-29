import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProblemDetailClient } from "@/app/(app)/problems/[id]/problem-detail-client";
import { applyFavoritesToSync } from "@/lib/integrations/apply-favorites";
import { auth } from "@/lib/auth";
import { fetchProblemsSync } from "@/lib/server/problems-sync";
import { getSessionFavoriteIds } from "@/lib/server/session-favorites";

type ProblemDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const [initialSync, favoriteIds] = await Promise.all([
    fetchProblemsSync(session.user.id),
    getSessionFavoriteIds(),
  ]);
  const sync = applyFavoritesToSync(initialSync, favoriteIds);
  const problem = sync.details.find((p) => p.id === id) ?? null;
  const related = problem
    ? sync.problems.filter((p) => problem.relatedIds.includes(p.id))
    : [];

  return (
    <ProblemDetailClient problem={problem} related={related} initialSync={sync} />
  );
}
