import { dashboardMock } from "@/mock/dashboard";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return dashboardMock;
}

export async function refreshDashboardData(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      error?: string;
    } | null;
    throw new Error(body?.message ?? body?.error ?? `Refresh failed: ${res.status}`);
  }

  return (await res.json()) as DashboardData;
}
