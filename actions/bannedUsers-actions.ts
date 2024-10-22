'use server';

import {
	checkIfUserBanned,
	banUser,
	unbanUser,
	getBanReason,
} from '@/db/queries/bannedUsers-queries';
import { getProfileByUserId } from '@/db/queries/profiles-queries';
import { InsertBannedUser } from '@/db/schema/bannedUsers-schema';
import { createGameNotificationAction } from './gameNotifications-actions';
import { deleteGameSlot } from '@/db/queries/slots-queries';
import { v4 as uuidv4 } from 'uuid';
import { getUserIdAction } from './profiles-actions';
import { createUserNotificationAction } from './userNotifications-actions';

export async function checkIfUserBannedAction(
	hostId: string,
	bannedUserId: string
) {
	try {
		return await checkIfUserBanned(hostId, bannedUserId);
	} catch (error) {
		console.error('Error checking if user is banned:', error, {
			hostId,
			bannedUserId,
		});
		throw new Error('Failed to check if user is banned');
	}
}

export async function banUserAction(banData: InsertBannedUser, gameId: string) {
	const banned = { ...banData, id: uuidv4(), createdAt: new Date() };
	try {
		// remove user's game slot
		await deleteGameSlot(banData.bannedUserId, gameId);
		// create game notification
		const userProfile = await getProfileByUserId(banData.bannedUserId);
		const hostProfile = await getProfileByUserId(banData.hostId);
		const username = userProfile?.username;
		await createGameNotificationAction({
			id: uuidv4(),
			gameId: gameId,
			notification: `${username} left the game`,
			createdAt: new Date(),
		});
		// create user notification for banned user
		await createUserNotificationAction({
			id: uuidv4(),
			userId: banData.bannedUserId,
			notification: `${hostProfile?.username} has banned you from their game. ${
				banData.reason ? `Reason: ${banData.reason}` : ''
			}`,
			createdAt: new Date(),
		});
		return await banUser(banned);
	} catch (error) {
		console.error('Error banning user:', error, { banData });
		throw new Error('Failed to ban user');
	}
}

export async function unbanUserAction(hostId: string, bannedUserId: string) {
	try {
		return await unbanUser(hostId, bannedUserId);
	} catch (error) {
		console.error('Error unbanning user:', error, { hostId, bannedUserId });
		throw new Error('Failed to unban user');
	}
}

export async function getBanReasonAction(gameId: string) {
	try {
		const bannedUserId = await getUserIdAction();
		return await getBanReason(gameId, bannedUserId);
	} catch (error) {
		console.error('Error getting ban reason:', error, { gameId });
		throw new Error('Failed to get ban reason');
	}
}
