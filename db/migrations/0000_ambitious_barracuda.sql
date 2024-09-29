DO $$ BEGIN
 CREATE TYPE "public"."membership" AS ENUM('free', 'pro');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"membership" "membership" DEFAULT 'free' NOT NULL,
	"email" text,
	"username" text,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GameSlots" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"is_host" boolean DEFAULT false,
	"slot_time" timestamp,
	"location" text,
	"game_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"host_id" uuid,
	"location" text,
	"date" timestamp,
	"flgs" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Notifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"game_id" uuid,
	"message" text,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Messages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"game_id" uuid,
	"sender_id" uuid,
	"message" text,
	"is_visible_to_joiners" boolean DEFAULT true,
	"is_from_ex_member" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GameSlots" ADD CONSTRAINT "GameSlots_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Games" ADD CONSTRAINT "Games_host_id_profiles_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_game_id_Games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."Games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Messages" ADD CONSTRAINT "Messages_game_id_Games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."Games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Messages" ADD CONSTRAINT "Messages_sender_id_profiles_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
