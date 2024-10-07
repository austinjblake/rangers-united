'use server';

import {
	checkNotificationBelongsToUser,
	createNotification,
	getNotificationsByUser,
} from '@/db/queries/userNotifications-queries';
import { InsertUserNotification } from '@/db/schema/userNotifications-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth-utils';
import {
	getGameInfoForSlot,
	getJoinerIdsForGame,
} from '@/db/queries/games-queries';
import { v4 as uuidv4 } from 'uuid';

// Action to create a new notification
export async function createUserNotificationAction(
	data: InsertUserNotification
): Promise<ActionState> {
	try {
		const newNotification = await createNotification(data);
		revalidatePath('/notifications');
		return {
			status: 'success',
			message: 'Notification created successfully',
			data: newNotification,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to create notification' };
	}
}

// Action to retrieve a notification by ID
export async function getUserNotifications(): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const notification = await getNotificationsByUser(user);
		return {
			status: 'success',
			message: 'Notification retrieved successfully',
			data: notification,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to get notification' };
	}
}

// Action to mark a notification as read
export async function markNotificationAsRead(
	notificationId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const notificationBelongsToUser = await checkNotificationBelongsToUser(
			notificationId,
			user
		);
		if (!notificationBelongsToUser) {
			return {
				status: 'error',
				message: 'Notification does not belong to user',
			};
		}
		await markNotificationAsRead(notificationId);
		return {
			status: 'success',
			message: 'Notification marked as read',
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to mark notification as read' };
	}
}

// Action to delete a notification
export async function deleteNotification(
	notificationId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const notificationBelongsToUser = await checkNotificationBelongsToUser(
			notificationId,
			user
		);
		if (!notificationBelongsToUser) {
			return {
				status: 'error',
				message: 'Notification does not belong to user',
			};
		}
		await deleteNotification(notificationId);
		return {
			status: 'success',
			message: 'Notification deleted successfully',
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to delete notification' };
	}
}

// create delete notifications for all users that have joined a game
export async function deleteNotificationsForGame(
	gameId: string,
	userId: string
): Promise<ActionState> {
	try {
		const result = await getGameInfoForSlot(userId, gameId);
		const game = result[0];
		const users = await getJoinerIdsForGame(gameId);
		for (const user of users) {
			await createUserNotificationAction({
				id: uuidv4(),
				userId: user,
				notification: `Your game hosted by ${game.hostUsername} at ${game.locationName} on ${game.gameDate} has been deleted by the host.`,
				createdAt: new Date(),
			});
		}
		return {
			status: 'success',
			message: 'Notifications deleted successfully',
		};
	} catch (error) {
		console.error('Error deleting notifications for game:', error);
		return {
			status: 'error',
			message: 'Failed to delete notifications for game',
		};
	}
}
