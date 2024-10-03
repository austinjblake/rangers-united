ALTER TABLE "GameSlots" DROP CONSTRAINT "GameSlots_location_id_Locations_id_fk";
--> statement-breakpoint
ALTER TABLE "GameSlots" ADD COLUMN "joiner_location_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GameSlots" ADD CONSTRAINT "GameSlots_joiner_location_id_Locations_id_fk" FOREIGN KEY ("joiner_location_id") REFERENCES "public"."Locations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "GameSlots" DROP COLUMN IF EXISTS "slot_time";--> statement-breakpoint
ALTER TABLE "GameSlots" DROP COLUMN IF EXISTS "location_id";--> statement-breakpoint
ALTER TABLE "Games" DROP COLUMN IF EXISTS "flgs";--> statement-breakpoint
ALTER TABLE "Games" DROP COLUMN IF EXISTS "private";