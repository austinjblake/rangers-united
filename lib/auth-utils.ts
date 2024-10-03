// auth-utils.ts

import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/db';
import { Games, gameSlotsTable, profilesTable } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

// 1. Check if the user is authenticated
export async function requireAuth() {
	const { userId } = auth();
	if (!userId) {
		throw new Error('User is not authenticated');
	}
	return userId; // Returns the userId for further use
}

// 2. Check if the user is the host of the game
export async function isUserHost(userId: string, gameId: string) {
	const game = await db
		.select()
		.from(Games)
		.where(eq(Games.id, gameId))
		.limit(1);

	if (!game || game[0].hostId !== userId) {
		throw new Error('User is not the host of this game');
	}
	return true; // User is the host
}

// 3. Check if the user has joined the game (is in game slots)
export async function hasUserJoinedGame(userId: string, gameId: string) {
	const gameSlot = await db
		.select()
		.from(gameSlotsTable)
		.where(
			and(eq(gameSlotsTable.gameId, gameId), eq(gameSlotsTable.userId, userId))
		)
		.limit(1);

	if (!gameSlot.length) {
		throw new Error('User has not joined this game');
	}
	return true; // User is a participant in the game
}

// 4. Check if the user has a specific membership level (optional)
export async function checkMembershipLevel(
	userId: string,
	requiredLevel: 'free' | 'pro'
) {
	const user = await db
		.select()
		.from(profilesTable)
		.where(eq(profilesTable.userId, userId))
		.limit(1);

	if (!user.length || user[0].membership !== requiredLevel) {
		throw new Error(
			`User does not have the required ${requiredLevel} membership`
		);
	}
	return true; // User has the correct membership level
}

// 5. Check if the user is an admin
export async function isUserAdmin(userId: string) {
	const user = await db
		.select()
		.from(profilesTable)
		.where(eq(profilesTable.userId, userId))
		.limit(1);

	if (!user.length || !user[0].isAdmin) {
		return false;
	}
	return true; // User is an admin
}
