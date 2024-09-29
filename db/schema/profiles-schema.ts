import { pgEnum, pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const membershipEnum = pgEnum('membership', ['free', 'pro']);

export const profilesTable = pgTable('profiles', {
	userId: text('user_id').primaryKey().notNull(),
	membership: membershipEnum('membership').notNull().default('free'),
	email: text('email').unique(),
	username: text('username'),
	stripeCustomerId: text('stripe_customer_id'),
	stripeSubscriptionId: text('stripe_subscription_id'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
	isAdmin: boolean('is_admin').default(false).notNull(),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
