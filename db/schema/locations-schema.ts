import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { geography } from '../geography-type';

export const locationsTable = pgTable('Locations', {
	id: uuid('id').primaryKey(),
	userId: text('user_id').references(() => profilesTable.userId),
	name: text('name').notNull(), // e.g., "My House", "Game Store 1"
	location: geography('location').notNull(), // Custom Geography type
	readableAddress: text('readable_address').notNull(),
	isFLGS: boolean('is_flgs').default(false),
	isPrivate: boolean('is_private').default(true),
});

export type InsertLocation = typeof locationsTable.$inferInsert;
export type SelectLocation = typeof locationsTable.$inferSelect;
