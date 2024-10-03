import { pgTable, uuid, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { locationsTable } from './locations-schema'; // Import the locationsTable

export const gamesTable = pgTable('Games', {
	id: uuid('id').primaryKey(),
	hostId: uuid('host_id')
		.references(() => profilesTable.userId)
		.notNull(),
	locationId: uuid('location_id')
		.references(() => locationsTable.id)
		.notNull(),
	date: timestamp('date'),
	flgs: boolean('flgs').default(false),
	private: boolean('private').default(false),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertGame = typeof gamesTable.$inferInsert;
export type SelectGame = typeof gamesTable.$inferSelect;
