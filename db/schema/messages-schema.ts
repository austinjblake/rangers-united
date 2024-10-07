import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { gamesTable } from './games-schema';
import { profilesTable } from './profiles-schema';

export const messagesTable = pgTable('messages', {
	id: uuid('id').primaryKey(),
	gameId: uuid('game_id')
		.references(() => gamesTable.id)
		.notNull(),
	senderId: text('sender_id')
		.references(() => profilesTable.userId)
		.notNull(),
	message: text('message'),
	isVisibleToJoiners: boolean('is_visible_to_joiners').default(true),
	isFromExMember: boolean('is_from_ex_member').default(false),
	createdAt: timestamp('created_at').defaultNow(),
	editedAt: timestamp('edited_at'),
	isDeleted: boolean('is_deleted').default(false),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
