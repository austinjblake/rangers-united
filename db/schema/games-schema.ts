import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';

export const Games = pgTable('Games', {
	id: uuid('id').primaryKey(),
	hostId: text('host_id').references(() => profilesTable.userId),
	location: text('location'),
	date: timestamp('date'),
	flgs: boolean('flgs').default(false),
	createdAt: timestamp('created_at').defaultNow(),
});

export type InsertGame = typeof Games.$inferInsert;
export type SelectGame = typeof Games.$inferSelect;
