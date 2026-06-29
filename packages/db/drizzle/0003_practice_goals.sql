CREATE TABLE "practice_goal" (
	"user_id" text NOT NULL,
	"cadence" text NOT NULL,
	"target_problems" integer NOT NULL,
	"target_study_minutes" integer NOT NULL,
	"contest_prep" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "practice_goal_user_id_cadence_pk" PRIMARY KEY("user_id","cadence")
);
--> statement-breakpoint
CREATE TABLE "practice_goal_completion" (
	"user_id" text NOT NULL,
	"cadence" text NOT NULL,
	"period_key" text NOT NULL,
	"contest_prep_done" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "practice_goal_completion_user_id_cadence_period_key_pk" PRIMARY KEY("user_id","cadence","period_key")
);
--> statement-breakpoint
ALTER TABLE "practice_goal" ADD CONSTRAINT "practice_goal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "practice_goal_completion" ADD CONSTRAINT "practice_goal_completion_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
