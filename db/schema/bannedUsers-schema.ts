import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
export const bannedUsersTable = pgTable('banned_users', {
	id: uuid('id').primaryKey().defaultRandom(),
	hostId: text('host_id')
		.notNull()
		.references(() => profilesTable.userId),
	bannedUserId: text('banned_user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	reason: text('reason'),
});

export type InsertBannedUser = typeof bannedUsersTable.$inferInsert;
export type SelectBannedUser = typeof bannedUsersTable.$inferSelect;
