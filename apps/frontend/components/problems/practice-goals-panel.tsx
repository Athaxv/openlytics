"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  savePracticeGoal,
  toggleContestPrepCompletion,
} from "@/services/practice-goals";
import type {
  PracticeGoalWithProgress,
  PracticeGoalsPayload,
} from "@/types/practice-goals";

type PracticeGoalsPanelProps = {
  goals: PracticeGoalsPayload;
  onGoalsChange: (goals: PracticeGoalsPayload) => void;
};

type GoalCardProps = {
  label: string;
  goal: PracticeGoalWithProgress;
  onGoalsChange: (goals: PracticeGoalsPayload) => void;
};

function ProgressBar({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function GoalCard({ label, goal, onGoalsChange }: GoalCardProps) {
  const [targetProblems, setTargetProblems] = useState(
    String(goal.targets.targetProblems),
  );
  const [targetStudyMinutes, setTargetStudyMinutes] = useState(
    String(goal.targets.targetStudyMinutes),
  );
  const [contestPrep, setContestPrep] = useState(goal.targets.contestPrep);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingPrep, setIsTogglingPrep] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cadence = goal.targets.cadence;

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await savePracticeGoal({
        cadence,
        targetProblems: Math.max(0, Number(targetProblems) || 0),
        targetStudyMinutes: Math.max(0, Number(targetStudyMinutes) || 0),
        contestPrep,
      });
      onGoalsChange(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goal");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContestPrepToggle = async (checked: boolean) => {
    setIsTogglingPrep(true);
    setError(null);
    try {
      const updated = await toggleContestPrepCompletion({
        cadence,
        contestPrepDone: checked,
      });
      onGoalsChange(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update prep status");
    } finally {
      setIsTogglingPrep(false);
    }
  };

  return (
    <article className="rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-sm font-medium text-foreground">{label}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">
        Period: {goal.progress.periodKey}
      </p>

      <div className="mt-4 space-y-3">
        <ProgressBar
          label="Problems solved"
          value={goal.progress.solvedProblems}
          max={goal.targets.targetProblems}
        />
        <ProgressBar
          label="Study minutes"
          value={goal.progress.studyMinutes}
          max={goal.targets.targetStudyMinutes}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">
            Target problems
          </label>
          <Input
            type="number"
            min={0}
            value={targetProblems}
            onChange={(event) => setTargetProblems(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-muted-foreground">
            Target study minutes
          </label>
          <Input
            type="number"
            min={0}
            value={targetStudyMinutes}
            onChange={(event) => setTargetStudyMinutes(event.target.value)}
          />
        </div>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={contestPrep}
          onChange={(event) => setContestPrep(event.target.checked)}
          className="size-4 rounded border-border"
        />
        Include contest prep in this plan
      </label>

      {contestPrep ? (
        <label
          className={cn(
            "mt-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm",
            goal.progress.contestPrepDone && "border-emerald-500/40 bg-emerald-500/10",
          )}
        >
          <input
            type="checkbox"
            checked={goal.progress.contestPrepDone}
            disabled={isTogglingPrep}
            onChange={(event) => void handleContestPrepToggle(event.target.checked)}
            className="size-4 rounded border-border"
          />
          Contest prep completed
        </label>
      ) : null}

      <Button
        type="button"
        size="sm"
        className="mt-4"
        onClick={() => void handleSave()}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save goals"}
      </Button>

      {error ? (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}

export function PracticeGoalsPanel({ goals, onGoalsChange }: PracticeGoalsPanelProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <GoalCard
        key={`daily-${goals.daily.progress.periodKey}-${goals.daily.progress.solvedProblems}-${goals.daily.progress.studyMinutes}`}
        label="Daily goals"
        goal={goals.daily}
        onGoalsChange={onGoalsChange}
      />
      <GoalCard
        key={`weekly-${goals.weekly.progress.periodKey}-${goals.weekly.progress.solvedProblems}-${goals.weekly.progress.studyMinutes}`}
        label="Weekly goals"
        goal={goals.weekly}
        onGoalsChange={onGoalsChange}
      />
    </section>
  );
}
