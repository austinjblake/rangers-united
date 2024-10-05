ALTER TABLE "GameSlots" RENAME TO "game_slots";--> statement-breakpoint
ALTER TABLE "Games" RENAME TO "games";--> statement-breakpoint
ALTER TABLE "Notifications" RENAME TO "notifications";--> statement-breakpoint
ALTER TABLE "Messages" RENAME TO "messages";--> statement-breakpoint
ALTER TABLE "Locations" RENAME TO "locations";--> statement-breakpoint
ALTER TABLE "game_slots" DROP CONSTRAINT "GameSlots_user_id_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "game_slots" DROP CONSTRAINT "GameSlots_joiner_location_id_Locations_id_fk";
--> statement-breakpoint
ALTER TABLE "game_slots" DROP CONSTRAINT "GameSlots_game_id_Games_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "Games_host_id_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "games" DROP CONSTRAINT "Games_location_id_Locations_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "Notifications_user_id_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "Notifications_game_id_Games_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "Messages_game_id_Games_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "Messages_sender_id_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "Locations_user_id_profiles_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_slots" ADD CONSTRAINT "game_slots_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_slots" ADD CONSTRAINT "game_slots_joiner_location_id_locations_id_fk" FOREIGN KEY ("joiner_location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "game_slots" ADD CONSTRAINT "game_slots_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_host_id_profiles_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "games" ADD CONSTRAINT "games_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_profiles_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "locations" ADD CONSTRAINT "locations_user_id_profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
