CREATE TABLE IF NOT EXISTS "banned_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_id" text NOT NULL,
	"banned_user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"reason" text
);
