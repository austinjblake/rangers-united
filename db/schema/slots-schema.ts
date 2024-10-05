import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { locationsTable } from './locations-schema';
import { gamesTable } from './games-schema';

export const gameSlotsTable = pgTable('game_slots', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	isHost: boolean('is_host').default(false),
	joinerLocationId: uuid('joiner_location_id').references(
		() => locationsTable.id
	),
	gameId: uuid('game_id')
		.references(() => gamesTable.id)
		.notNull(),
});

export type InsertGameSlot = typeof gameSlotsTable.$inferInsert;
export type SelectGameSlot = typeof gameSlotsTable.$inferSelect;
