import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { gamesTable } from './games-schema';

export const notificationsTable = pgTable('notifications', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	gameId: uuid('game_id')
		.references(() => gamesTable.id)
		.notNull(),
	notification: text('message'),
	isRead: boolean('is_read').default(false),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertNotification = typeof notificationsTable.$inferInsert;
export type SelectNotification = typeof notificationsTable.$inferSelect;
