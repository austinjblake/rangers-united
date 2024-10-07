ALTER TABLE "game_notifications" DROP CONSTRAINT "game_notifications_user_id_profiles_user_id_fk";
--> statement-breakpoint
ALTER TABLE "game_notifications" ALTER COLUMN "message" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "game_notifications" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "game_notifications" DROP COLUMN IF EXISTS "is_read";