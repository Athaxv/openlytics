export type PracticeGoalCadence = "daily" | "weekly";

export type PracticeGoalTargets = {
  cadence: PracticeGoalCadence;
  targetProblems: number;
  targetStudyMinutes: number;
  contestPrep: boolean;
};

export type PracticeGoalProgress = {
  periodKey: string;
  solvedProblems: number;
  studyMinutes: number;
  contestPrepDone: boolean;
};

export type PracticeGoalWithProgress = {
  targets: PracticeGoalTargets;
  progress: PracticeGoalProgress;
};

export type PracticeGoalsPayload = {
  daily: PracticeGoalWithProgress;
  weekly: PracticeGoalWithProgress;
};

export type UpsertPracticeGoalRequest = {
  cadence: PracticeGoalCadence;
  targetProblems: number;
  targetStudyMinutes: number;
  contestPrep: boolean;
};

export type ToggleContestPrepRequest = {
  cadence: PracticeGoalCadence;
  contestPrepDone: boolean;
};
