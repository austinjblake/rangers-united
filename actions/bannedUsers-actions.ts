'use server';

import {
	checkIfUserBanned,
	banUser,
	unbanUser,
	getBanReason,
	getBannedUsersForHost,
} from '@/db/queries/bannedUsers-queries';
import { getProfileByUserId } from '@/db/queries/profiles-queries';
import { InsertBannedUser } from '@/db/schema/bannedUsers-schema';
import { createGameNotificationAction } from './gameNotifications-actions';
import { deleteGameSlot } from '@/db/queries/slots-queries';
import { v4 as uuidv4 } from 'uuid';
import { getUserIdAction } from './profiles-actions';
import { createUserNotificationAction } from './userNotifications-actions';
import { hasUserJoinedGame, requireAuth } from '@/lib/auth-utils';
import { getAllHostedGames } from '@/db/queries/games-queries';

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
		const userProfile = await getProfileByUserId(banData.bannedUserId);
		const hostProfile = await getProfileByUserId(banData.hostId);
		const allGamesByHost = await getAllHostedGames(banData.hostId);
		// user will be banned from all games by host
		for (const game of allGamesByHost) {
			if (await hasUserJoinedGame(banData.bannedUserId, game.id)) {
				// remove user's game slot. will remove temp location and messages
				await deleteGameSlot(banData.bannedUserId, game.id);
				// create game notification
				const username = userProfile?.username;
				await createGameNotificationAction({
					id: uuidv4(),
					gameId: game.id,
					notification: `${username} has been banned from the game`,
					createdAt: new Date(),
				});
				// create user notification for banned user
				await createUserNotificationAction({
					id: uuidv4(),
					userId: banData.bannedUserId,
					notification: `${
						hostProfile?.username
					} has banned you from their game. ${
						banData.reason ? `Reason: ${banData.reason}` : ''
					}`,
					createdAt: new Date(),
				});
			}
		}
		// ban is dependent on host/user so only need to ban once
		return await banUser(banned);
	} catch (error) {
		console.error('Error banning user:', error, { banData });
		throw new Error('Failed to ban user');
	}
}

export async function unbanUserAction(bannedUserId: string) {
	const hostId = await requireAuth();
	try {
		await unbanUser(hostId, bannedUserId);
		return { status: 'success', message: 'User unbanned successfully' };
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

export async function getBannedUsersForHostAction() {
	const hostId = await requireAuth();
	try {
		return await getBannedUsersForHost(hostId);
	} catch (error) {
		console.error('Error getting banned users for host:', error, { hostId });
		throw new Error('Failed to get banned users for host');
	}
}
