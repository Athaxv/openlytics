"use client";

import { useCallback, useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { DigitalTimer } from "@/components/sessions/digital-timer";
import { SpacebarHint } from "@/components/sessions/spacebar-hint";
import { StopSessionDialog } from "@/components/sessions/stop-session-dialog";
import { Button } from "@/components/ui/button";
import { useCreateSession } from "@/hooks/use-create-session";
import {
  useTimerStore,
  type SessionSnapshot,
} from "@/lib/stores/timer-store";

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function TimerWidget() {
  const {
    status,
    elapsedSeconds,
    start,
    pause,
    resume,
    reset,
    tick,
    getSessionSnapshot,
  } = useTimerStore();
  const { mutate: saveSession } = useCreateSession();
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [pendingSnapshot, setPendingSnapshot] = useState<SessionSnapshot | null>(
    null,
  );
  const [wasRunningBeforeStop, setWasRunningBeforeStop] = useState(false);

  useEffect(() => {
    if (status !== "running") return;

    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [status, tick]);

  const flashSpaceHint = useCallback(() => {
    setSpacePressed(true);
    window.setTimeout(() => setSpacePressed(false), 180);
  }, []);

  const openStopDialog = useCallback(() => {
    const wasRunning = useTimerStore.getState().status === "running";
    if (wasRunning) {
      pause();
    }

    const snapshot = getSessionSnapshot();
    setPendingSnapshot(snapshot);
    setWasRunningBeforeStop(wasRunning);
    setStopDialogOpen(true);
  }, [getSessionSnapshot, pause]);

  const closeStopDialog = useCallback(
    (resumeIfNeeded: boolean) => {
      if (resumeIfNeeded && wasRunningBeforeStop) {
        resume();
      }
      setPendingSnapshot(null);
      setWasRunningBeforeStop(false);
      setStopDialogOpen(false);
    },
    [resume, wasRunningBeforeStop],
  );

  const handleStopDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeStopDialog(true);
      }
    },
    [closeStopDialog],
  );

  const handleStopConfirm = useCallback(() => {
    const snapshot = pendingSnapshot;

    setStopDialogOpen(false);
    setPendingSnapshot(null);
    setWasRunningBeforeStop(false);
    reset();

    if (snapshot && snapshot.elapsedSeconds >= 1) {
      saveSession(
        {
          startedAt: snapshot.startedAt,
          endedAt: snapshot.endedAt,
          durationMin: snapshot.durationMin,
        },
        {
          onError: (error) => {
            console.error("[TimerWidget] Failed to save session:", error);
          },
        },
      );
    }
  }, [pendingSnapshot, reset, saveSession]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      if (isEditableTarget(event.target) || stopDialogOpen) return;

      event.preventDefault();
      flashSpaceHint();

      if (status === "idle") {
        start();
        return;
      }

      if (status === "running") {
        openStopDialog();
        return;
      }

      if (status === "paused") {
        resume();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flashSpaceHint, openStopDialog, resume, start, status, stopDialogOpen]);

  const frozenElapsedSeconds =
    pendingSnapshot?.elapsedSeconds ?? elapsedSeconds;

  return (
    <div className="flex w-full max-w-5xl flex-col items-center">
      <DigitalTimer elapsedSeconds={elapsedSeconds} />

      <SpacebarHint status={status} pressed={spacePressed} />

      <div className="mt-6 flex items-center justify-center gap-2">
        {status === "idle" && (
          <Button size="icon" variant="outline" onClick={start} aria-label="Start session">
            <Play size={18} />
          </Button>
        )}
        {status === "running" && (
          <>
            <Button size="icon" variant="outline" onClick={pause} aria-label="Pause session">
              <Pause size={18} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={openStopDialog}
              aria-label="Stop session"
            >
              <RotateCcw size={18} />
            </Button>
          </>
        )}
        {status === "paused" && (
          <>
            <Button size="icon" variant="outline" onClick={resume} aria-label="Resume session">
              <Play size={18} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={openStopDialog}
              aria-label="Stop session"
            >
              <RotateCcw size={18} />
            </Button>
          </>
        )}
      </div>

      <StopSessionDialog
        open={stopDialogOpen}
        onOpenChange={handleStopDialogChange}
        elapsedSeconds={frozenElapsedSeconds}
        onConfirm={handleStopConfirm}
      />
    </div>
  );
}
