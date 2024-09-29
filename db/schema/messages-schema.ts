import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { Games } from './games-schema';
import { profilesTable } from './profiles-schema';

export const messagesTable = pgTable('Messages', {
	id: uuid('id').primaryKey(),
	gameId: uuid('game_id').references(() => Games.id),
	senderId: uuid('sender_id').references(() => profilesTable.userId),
	message: text('message'),
	isVisibleToJoiners: boolean('is_visible_to_joiners').default(true),
	isFromExMember: boolean('is_from_ex_member').default(false),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
