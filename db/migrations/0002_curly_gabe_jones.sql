DO $$ BEGIN
 ALTER TABLE "banned_users" ADD CONSTRAINT "banned_users_host_id_profiles_user_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "banned_users" ADD CONSTRAINT "banned_users_banned_user_id_profiles_user_id_fk" FOREIGN KEY ("banned_user_id") REFERENCES "public"."profiles"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
