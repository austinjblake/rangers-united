import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';

export const gameSlotsTable = pgTable('GameSlots', {
	id: uuid('id').primaryKey(),
	userId: uuid('user_id').references(() => profilesTable.userId),
	isHost: boolean('is_host').default(false),
	slotTime: timestamp('slot_time'),
	location: text('location'),
	gameId: uuid('game_id'),
});

export type InsertGameSlot = typeof gameSlotsTable.$inferInsert;
export type SelectGameSlot = typeof gameSlotsTable.$inferSelect;
