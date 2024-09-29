'use server';

import {
	createNotification,
	deleteNotification,
	getNotificationsByGameId,
	getNotificationsByUser,
	markNotificationAsRead,
	getNotificationById, // Added import for getNotificationById
} from '@/db/queries/notifications-queries';
import { InsertNotification } from '@/db/schema/notifications-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { requireAuth, hasUserJoinedGame, isUserAdmin } from '@/lib/auth-utils';

// Action to create a new notification
export async function createNotificationAction(
	data: InsertNotification
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
		if (!joinedGame || !isAdmin) {
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

// Action to retrieve all notifications for a specific user
export async function getNotificationsByUserIdAction(
	userId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		if (user !== userId) {
			throw new Error('User does not have access to these notifications');
		}
		const notifications = await getNotificationsByUser(userId);
		return {
			status: 'success',
			message: 'Notifications retrieved successfully',
			data: notifications,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to get notifications' };
	}
}

// Action to mark a notification as read by its ID
export async function markNotificationAsReadAction(
	notificationId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();

		// First, fetch the notification to check ownership
		const notification = await getNotificationById(notificationId);

		if (!notification) {
			throw new Error('Notification not found');
		}

		if (notification.userId !== user) {
			throw new Error(
				'User does not have permission to mark this notification as read'
			);
		}

		const updatedNotification = await markNotificationAsRead(notificationId);
		revalidatePath('/notifications');
		return {
			status: 'success',
			message: 'Notification marked as read successfully',
			data: updatedNotification,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to mark notification as read' };
	}
}

// Action to delete a notification by ID
export async function deleteNotificationAction(
	notificationId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);

		// First, fetch the notification to check ownership
		const notification = await getNotificationById(notificationId);

		if (!notification) {
			throw new Error('Notification not found');
		}

		if (!isAdmin || notification.userId !== user) {
			throw new Error(
				'User does not have permission to delete this notification'
			);
		}

		await deleteNotification(notificationId);
		revalidatePath('/notifications');
		return { status: 'success', message: 'Notification deleted successfully' };
	} catch (error) {
		return { status: 'error', message: 'Failed to delete notification' };
	}
}
