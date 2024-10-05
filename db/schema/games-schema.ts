import { pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { locationsTable } from './locations-schema';

export const gamesTable = pgTable('games', {
	id: uuid('id').primaryKey(),
	hostId: uuid('host_id')
		.references(() => profilesTable.userId)
		.notNull(),
	locationId: uuid('location_id')
		.references(() => locationsTable.id)
		.notNull(),
	date: timestamp('date'),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;
