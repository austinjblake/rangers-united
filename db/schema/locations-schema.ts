import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { profilesTable } from './profiles-schema';
import { geography } from '../geography-type';

export const locationsTable = pgTable('Locations', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => profilesTable.userId)
		.notNull(),
	name: text('name').default('Custom Location'), // e.g., "My House", "Game Store 1"
	location: geography('location').notNull(), // Custom Geography type
	readableAddress: text('readable_address').notNull(),
	isFLGS: boolean('is_flgs').default(false),
	isPrivate: boolean('is_private').default(true),
	temporary: boolean('temporary').default(false), // If true, the location is not saved to any user's list and will be deleted after the game is ended
});

export type InsertLocation = typeof locationsTable.$inferInsert;
export type SelectLocation = typeof locationsTable.$inferSelect;
