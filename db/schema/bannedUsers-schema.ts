import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';

export const bannedUsersTable = pgTable('banned_users', {
	id: uuid('id').primaryKey().defaultRandom(),
	hostId: text('host_id').notNull(),
	bannedUserId: text('banned_user_id').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
	reason: text('reason'),
});
