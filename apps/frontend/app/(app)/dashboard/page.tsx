import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/app/(app)/dashboard/dashboard-client";
import { auth } from "@/lib/auth";
import { fetchDashboardData } from "@/lib/server/dashboard-data";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  const data = await fetchDashboardData(session.user.id);
  const userName = session.user.name ?? session.user.email ?? "there";

  return <DashboardClient data={data} userName={userName} />;
}
