import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { locationsTable } from './locations-schema';

export const savedSearchesTable = pgTable('saved_searches', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	locationId: uuid('location_id')
		.references(() => locationsTable.id)
		.notNull(),
	radius: integer('radius'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow(),
});

export type InsertSavedSearch = typeof savedSearchesTable.$inferInsert;
export type SelectSavedSearch = typeof savedSearchesTable.$inferSelect;
