"use client";

import { create } from "zustand";

export type TimerStatus = "idle" | "running" | "paused";

export type SessionSnapshot = {
  startedAt: string;
  endedAt: string;
  durationMin: number;
  elapsedSeconds: number;
};

type TimerState = {
  status: TimerStatus;
  elapsedSeconds: number;
  accumulatedMs: number;
  runningSince: number | null;
  startedAt: number | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  tick: () => void;
  getSessionSnapshot: () => SessionSnapshot | null;
};

function getElapsedMs(state: Pick<TimerState, "accumulatedMs" | "runningSince">) {
  if (!state.runningSince) {
    return state.accumulatedMs;
  }

  return state.accumulatedMs + (Date.now() - state.runningSince);
}

export const useTimerStore = create<TimerState>((set, get) => ({
  status: "idle",
  elapsedSeconds: 0,
  accumulatedMs: 0,
  runningSince: null,
  startedAt: null,

  start: () =>
    set({
      status: "running",
      elapsedSeconds: 0,
      accumulatedMs: 0,
      runningSince: Date.now(),
      startedAt: Date.now(),
    }),

  pause: () => {
    const state = get();
    if (state.status !== "running") return;

    const totalMs = getElapsedMs(state);
    set({
      status: "paused",
      accumulatedMs: totalMs,
      runningSince: null,
      elapsedSeconds: Math.floor(totalMs / 1000),
    });
  },

  resume: () => {
    if (get().status !== "paused") return;

    set({
      status: "running",
      runningSince: Date.now(),
    });
  },

  reset: () =>
    set({
      status: "idle",
      elapsedSeconds: 0,
      accumulatedMs: 0,
      runningSince: null,
      startedAt: null,
    }),

  tick: () => {
    const state = get();
    if (state.status !== "running" || !state.runningSince) return;

    const totalMs = getElapsedMs(state);
    set({ elapsedSeconds: Math.floor(totalMs / 1000) });
  },

  getSessionSnapshot: () => {
    const state = get();
    if (!state.startedAt) return null;

    const totalMs = getElapsedMs(state);
    const elapsedSeconds = Math.floor(totalMs / 1000);
    const endedAt = new Date();
    const startedAt = new Date(state.startedAt);

    return {
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
      durationMin: Math.max(1, Math.round(elapsedSeconds / 60)),
      elapsedSeconds,
    };
  },
}));
