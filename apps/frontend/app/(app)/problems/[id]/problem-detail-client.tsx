"use client";

import { useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { TopicChip } from "@/components/common/topic-chip";
import { DifficultyBadge } from "@/components/problems/difficulty-badge";
import { FavoriteButton } from "@/components/problems/favorite-button";
import { SolutionPanel } from "@/components/problems/solution-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { seedProblemsCache } from "@/services/problems";
import type { Problem, ProblemDetail, ProblemsSyncResult } from "@/types/problems";

type ProblemDetailClientProps = {
  problem: ProblemDetail | null;
  related: Problem[];
  initialSync: ProblemsSyncResult;
};

export function ProblemDetailClient({
  problem,
  related,
  initialSync,
}: ProblemDetailClientProps) {
  seedProblemsCache(initialSync);
  const [favorite, setFavorite] = useState(problem?.favorite ?? false);

  if (!problem) {
    return (
      <div className="space-y-6">
        <PageHeader title="Problem not found" description="This problem does not exist." />
        <Button render={<Link href="/problems" />}>
          <ArrowLeft size={16} />
          Back to problems
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" render={<Link href="/problems" />}>
          <ArrowLeft size={16} />
          Back
        </Button>
      </div>

      <PageHeader
        title={problem.title}
        description={problem.description}
        action={
          <div className="flex items-center gap-2">
            <FavoriteButton
              problemId={problem.id}
              favorite={favorite}
              size={18}
              onFavoriteChange={setFavorite}
            />
            <Button
              variant="outline"
              size="sm"
              render={<a href={problem.url} target="_blank" rel="noreferrer" />}
            >
              <ExternalLink size={14} />
              Open on {problem.platform}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4 rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-muted-foreground">Metadata</h3>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Platform</dt>
              <dd className="capitalize">{problem.platform}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd>
                <DifficultyBadge difficulty={problem.difficulty} />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Solve time</dt>
              <dd>{problem.solveTimeMin > 0 ? `${problem.solveTimeMin} min` : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Attempts</dt>
              <dd>{problem.attempts}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Solved</dt>
              <dd>{format(parseISO(problem.solvedAt), "MMM d, yyyy")}</dd>
            </div>
          </dl>

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Topics</p>
            <div className="flex flex-wrap gap-1.5">
              {problem.topics.length > 0 ? (
                problem.topics.map((t) => <TopicChip key={t} topic={t} />)
              ) : (
                <span className="text-sm text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground">AI concepts</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {problem.aiConcepts.length > 0 ? (
                problem.aiConcepts.map((concept) => (
                  <li key={concept} className="flex gap-2">
                    <span className="text-primary">·</span>
                    {concept}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No AI notes yet.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Mistakes to avoid</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {problem.mistakes.length > 0 ? (
                problem.mistakes.map((mistake) => (
                  <li key={mistake} className="text-rose-400">
                    {mistake}
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">None recorded.</li>
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Revision history</h3>
            <div className="mt-3 space-y-3">
              {problem.revisionHistory.length > 0 ? (
                problem.revisionHistory.map((entry) => (
                  <div key={entry.date} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(entry.date), "MMM d, yyyy")}
                    </p>
                    <p className="mt-1 text-sm">{entry.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No revisions yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-medium text-muted-foreground">Personal notes</h3>
            <Textarea
              className="mt-3"
              defaultValue={problem.personalNotes}
              placeholder="Add your notes..."
              rows={4}
            />
          </div>
        </section>
      </div>

      <SolutionPanel problem={problem} />

      {related.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-muted-foreground">Related problems</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/problems/${p.id}`}
                className="rounded-md border border-border p-3 transition-colors hover:bg-muted/50"
              >
                <p className="font-medium">{p.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <DifficultyBadge difficulty={p.difficulty} />
                  <span className="text-xs capitalize text-muted-foreground">{p.platform}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
