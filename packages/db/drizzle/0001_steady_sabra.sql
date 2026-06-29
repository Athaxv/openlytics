CREATE TABLE "problem_favorite" (
	"user_id" text NOT NULL,
	"problem_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	CONSTRAINT "problem_favorite_user_id_problem_id_pk" PRIMARY KEY("user_id","problem_id")
);
--> statement-breakpoint
ALTER TABLE "problem_favorite" ADD CONSTRAINT "problem_favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;