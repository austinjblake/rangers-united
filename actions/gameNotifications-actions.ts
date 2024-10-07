'use server';

import {
	createNotification,
	getNotificationsByGameId,
} from '@/db/queries/gameNotifications-queries';
import { InsertGameNotification } from '@/db/schema/gameNotifications-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { requireAuth, hasUserJoinedGame, isUserAdmin } from '@/lib/auth-utils';

// Action to create a new notification
export async function createNotificationAction(
	data: InsertGameNotification
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
export async function getNotificationByGameIdAction(
	gameId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const joinedGame = await hasUserJoinedGame(user, gameId);
		const isAdmin = await isUserAdmin(user);
		if (!joinedGame && !isAdmin) {
			throw new Error('User has not joined the game');
		}
		const notification = await getNotificationsByGameId(gameId);
		return {
			status: 'success',
			message: 'Notification retrieved successfully',
			data: notification,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to get notification' };
	}
}
