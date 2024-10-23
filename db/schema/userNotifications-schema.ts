import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';

export const userNotificationsTable = pgTable('user_notifications', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	notification: text('message').notNull(),
	isRead: boolean('is_read').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	gameId: text('game_id'), // not referenced to games table because games could be deleted before userNotifications
});

export type InsertUserNotification = typeof userNotificationsTable.$inferInsert;
export type SelectUserNotification = typeof userNotificationsTable.$inferSelect;
