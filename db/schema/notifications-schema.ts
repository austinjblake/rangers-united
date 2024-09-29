import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { Games } from './games-schema';

export const notificationsTable = pgTable('Notifications', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => profilesTable.userId),
	gameId: uuid('game_id').references(() => Games.id),
	message: text('message'),
	isRead: boolean('is_read').default(false),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertNotification = typeof notificationsTable.$inferInsert;
export type SelectNotification = typeof notificationsTable.$inferSelect;
