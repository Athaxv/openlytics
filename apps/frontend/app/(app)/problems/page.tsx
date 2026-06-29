import { Suspense } from "react";
import { ProblemsPageClient } from "@/app/(app)/problems/problems-client";
import { auth } from "@/lib/auth";
import { fetchProblemsPageData } from "@/lib/server/problems-page-data";
import { headers } from "next/headers";

export default async function ProblemsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const payload = await fetchProblemsPageData(session.user.id);

  return (
    <Suspense fallback={null}>
      <ProblemsPageClient data={payload} />
    </Suspense>
  );
}
