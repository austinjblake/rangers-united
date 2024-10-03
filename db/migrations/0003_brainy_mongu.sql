ALTER TABLE "GameSlots" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "GameSlots" ALTER COLUMN "location_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "GameSlots" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Games" ALTER COLUMN "host_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Games" ALTER COLUMN "location_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Notifications" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Notifications" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Messages" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Messages" ALTER COLUMN "sender_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Locations" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GameSlots" ADD CONSTRAINT "GameSlots_game_id_Games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."Games"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
