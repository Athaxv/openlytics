import { AppShell } from "@/components/layout/app-shell";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <AppShell
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
    >
      {children}
    </AppShell>
  );
}
