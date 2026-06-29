"use client";

import { EmptyState } from "@/components/common/empty-state";
import { SessionCard } from "@/components/sessions/session-card";
import { SessionCalendar } from "@/components/sessions/session-calendar";
import { TimerWidget } from "@/components/sessions/timer-widget";
import { ManualLogDialog } from "@/components/sessions/manual-log-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessions } from "@/hooks/use-sessions";

export default function SessionsPage() {
  const { data: sessions, isLoading } = useSessions();

  return (
    <div className="space-y-8">
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
        <TimerWidget />
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-medium text-muted-foreground">Quick stats</h3>
          <ManualLogDialog />
        </div>
        {isLoading ? (
          <Skeleton className="mt-4 h-20 w-full" />
        ) : (
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">Total sessions</dt>
              <dd className="text-2xl font-semibold">{sessions?.length ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Total hours</dt>
              <dd className="text-2xl font-semibold">
                {sessions
                  ? (sessions.reduce((sum, s) => sum + s.durationMin, 0) / 60).toFixed(1)
                  : 0}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Avg productivity</dt>
              <dd className="text-2xl font-semibold">
                {sessions && sessions.length > 0
                  ? Math.round(
                      sessions.reduce((sum, s) => sum + s.productivityScore, 0) /
                        sessions.length,
                    )
                  : 0}
                %
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Problems logged</dt>
              <dd className="text-2xl font-semibold">
                {sessions?.reduce((sum, s) => sum + s.problemsSolved.length, 0) ?? 0}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <EmptyState
              title="No sessions yet"
              description="Press space to start your first focus session."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : (
            <SessionCalendar sessions={sessions ?? []} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
