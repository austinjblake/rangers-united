import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import {
	bannedUsersTable,
	InsertBannedUser,
} from '@/db/schema/bannedUsers-schema';
import { gamesTable } from '@/db/schema/games-schema';

export async function checkIfUserBanned(hostId: string, bannedUserId: string) {
	try {
		const result = await db
			.select()
			.from(bannedUsersTable)
			.where(
				and(
					eq(bannedUsersTable.hostId, hostId),
					eq(bannedUsersTable.bannedUserId, bannedUserId)
				)
			)
			.limit(1);

		return result.length > 0;
	} catch (error) {
		console.error('Error checking if user is banned:', error);
		throw new Error('Failed to check if user is banned');
	}
}

export async function banUser(banData: InsertBannedUser) {
	try {
		const result = await db
			.insert(bannedUsersTable)
			.values(banData)
			.returning();
		return result[0];
	} catch (error) {
		console.error('Error banning user:', error);
		throw new Error('Failed to ban user');
	}
}

export async function unbanUser(hostId: string, bannedUserId: string) {
	try {
		const result = await db
			.delete(bannedUsersTable)
			.where(
				and(
					eq(bannedUsersTable.hostId, hostId),
					eq(bannedUsersTable.bannedUserId, bannedUserId)
				)
			)
			.returning();

		if (result.length === 0) {
			throw new Error('User was not banned or already unbanned');
		}

		return result[0];
	} catch (error) {
		console.error('Error unbanning user:', error);
		throw new Error('Failed to unban user');
	}
}

export async function getBanReason(gameId: string, bannedUserId: string) {
	try {
		const result = await db
			.select({ reason: bannedUsersTable.reason })
			.from(bannedUsersTable)
			.innerJoin(gamesTable, eq(gamesTable.hostId, bannedUsersTable.hostId))
			.where(
				and(
					eq(gamesTable.id, gameId),
					eq(bannedUsersTable.bannedUserId, bannedUserId)
				)
			)
			.limit(1);

		return result[0]?.reason || null;
	} catch (error) {
		console.error('Error getting ban reason:', error);
		throw new Error('Failed to get ban reason');
	}
}
