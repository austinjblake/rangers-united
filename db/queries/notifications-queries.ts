import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import {
	notificationsTable,
	InsertNotification,
	SelectNotification,
} from '../schema/notifications-schema';

// 1. Insert a new notification (e.g., notify a user about a game update)
export const createNotification = async (
	notificationData: InsertNotification
) => {
	try {
		await db.insert(notificationsTable).values(notificationData);
		console.log('Notification created successfully');
	} catch (error) {
		console.error('Error creating notification:', error);
		throw error;
	}
};

// 2. Select all notifications for a specific user (e.g., to display in a notifications list)
export const getNotificationsByUser = async (userId: string) => {
	try {
		const result = await db
			.select()
			.from(notificationsTable)
			.where(eq(notificationsTable.userId, userId));
		return result;
	} catch (error) {
		console.error('Error fetching notifications for user:', error);
		throw error;
	}
};

// 3. Mark a notification as read (update the `isRead` flag)
export const markNotificationAsRead = async (notificationId: string) => {
	try {
		await db
			.update(notificationsTable)
			.set({ isRead: true })
			.where(eq(notificationsTable.id, notificationId));
		console.log('Notification marked as read');
	} catch (error) {
		console.error('Error marking notification as read:', error);
		throw error;
	}
};

// 4. Delete a notification (e.g., after it is no longer relevant)
export const deleteNotification = async (notificationId: string) => {
	try {
		await db
			.delete(notificationsTable)
			.where(eq(notificationsTable.id, notificationId));
		console.log('Notification deleted successfully');
	} catch (error) {
		console.error('Error deleting notification:', error);
		throw error;
	}
};

// 5. Get unread notifications for a specific user
export const getUnreadNotificationsByUser = async (userId: string) => {
	try {
		const result = await db
			.select()
			.from(notificationsTable)
			.where(
				and(
					eq(notificationsTable.userId, userId),
					eq(notificationsTable.isRead, false)
				)
			);
		return result;
	} catch (error) {
		console.error('Error fetching unread notifications for user:', error);
		throw error;
	}
};

// 6. Get all notifications for a specific game (e.g., for hosts/admins to review)
export const getNotificationsByGameId = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(notificationsTable)
			.where(eq(notificationsTable.gameId, gameId));
		return result;
	} catch (error) {
		console.error('Error fetching notifications for game:', error);
		throw error;
	}
};

export async function getNotificationById(
	notificationId: string
): Promise<SelectNotification | null> {
	const [notification] = await db
		.select()
		.from(notificationsTable)
		.where(eq(notificationsTable.id, notificationId))
		.limit(1);

	return notification || null;
}
