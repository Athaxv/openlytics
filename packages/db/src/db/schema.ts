import { boolean, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const problemFavorite = pgTable(
  "problem_favorite",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    problemId: text("problem_id").notNull(),
    createdAt: timestamp("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemId] })],
);

export const studySession = pgTable("study_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at").notNull(),
  durationMin: integer("duration_min").notNull(),
  platform: text("platform").notNull().default("mixed"),
  notes: text("notes").notNull().default(""),
  problemsSolved: text("problems_solved").notNull().default("[]"),
  productivityScore: integer("productivity_score").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
});

export const practiceGoal = pgTable(
  "practice_goal",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cadence: text("cadence").notNull(),
    targetProblems: integer("target_problems").notNull(),
    targetStudyMinutes: integer("target_study_minutes").notNull(),
    contestPrep: boolean("contest_prep").notNull().default(false),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.cadence] })],
);

export const practiceGoalCompletion = pgTable(
  "practice_goal_completion",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    cadence: text("cadence").notNull(),
    periodKey: text("period_key").notNull(),
    contestPrepDone: boolean("contest_prep_done").notNull().default(false),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.cadence, t.periodKey] })],
);

export const solvedProblem = pgTable(
  "solved_problem",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    problemId: text("problem_id").notNull(),
    platform: text("platform").notNull(),
    title: text("title").notNull(),
    difficulty: text("difficulty").notNull(),
    topics: text("topics").notNull().default("[]"),
    solvedAt: text("solved_at").notNull(),
    solveTimeMin: integer("solve_time_min").notNull().default(0),
    attempts: integer("attempts").notNull().default(1),
    url: text("url"),
    submissionId: text("submission_id"),
    language: text("language"),
    aiNotePreview: text("ai_note_preview").notNull().default(""),
    description: text("description"),
    aiConcepts: text("ai_concepts").notNull().default("[]"),
    mistakes: text("mistakes").notNull().default("[]"),
    revisionHistory: text("revision_history").notNull().default("[]"),
    personalNotes: text("personal_notes").notNull().default(""),
    firstSyncedAt: timestamp("first_synced_at").notNull(),
    lastSyncedAt: timestamp("last_synced_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.problemId] })],
);