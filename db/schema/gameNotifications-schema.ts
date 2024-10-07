import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { gamesTable } from './games-schema';

export const gameNotificationsTable = pgTable('game_notifications', {
	id: uuid('id').primaryKey(),
	gameId: uuid('game_id')
		.references(() => gamesTable.id)
		.notNull(),
	notification: text('message').notNull(),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertGameNotification = typeof gameNotificationsTable.$inferInsert;
export type SelectGameNotification = typeof gameNotificationsTable.$inferSelect;
