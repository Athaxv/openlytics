CREATE TABLE "solved_problem" (
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"platform" text NOT NULL,
	"title" text NOT NULL,
	"difficulty" text NOT NULL,
	"topics" text DEFAULT '[]' NOT NULL,
	"solved_at" text NOT NULL,
	"solve_time_min" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"url" text,
	"submission_id" text,
	"language" text,
	"ai_note_preview" text DEFAULT '' NOT NULL,
	"description" text,
	"ai_concepts" text DEFAULT '[]' NOT NULL,
	"mistakes" text DEFAULT '[]' NOT NULL,
	"revision_history" text DEFAULT '[]' NOT NULL,
	"personal_notes" text DEFAULT '' NOT NULL,
	"first_synced_at" timestamp NOT NULL,
	"last_synced_at" timestamp NOT NULL,
	CONSTRAINT "solved_problem_user_id_problem_id_pk" PRIMARY KEY("user_id","problem_id")
);
--> statement-breakpoint
ALTER TABLE "solved_problem" ADD CONSTRAINT "solved_problem_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
