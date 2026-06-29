CREATE TABLE "study_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp NOT NULL,
	"duration_min" integer NOT NULL,
	"platform" text DEFAULT 'mixed' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"problems_solved" text DEFAULT '[]' NOT NULL,
	"productivity_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "study_session" ADD CONSTRAINT "study_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;