import { eq, and } from 'drizzle-orm';
import { db } from '../db';
import {
	userNotificationsTable,
	InsertUserNotification,
	SelectUserNotification,
} from '../schema/userNotifications-schema';

// 1. Insert a new notification (e.g., notify a user about a game update)
export const createNotification = async (
	notificationData: InsertUserNotification
) => {
	try {
		await db.insert(userNotificationsTable).values(notificationData);
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
			.from(userNotificationsTable)
			.where(eq(userNotificationsTable.userId, userId));
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
			.update(userNotificationsTable)
			.set({ isRead: true })
			.where(eq(userNotificationsTable.id, notificationId));
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
			.delete(userNotificationsTable)
			.where(eq(userNotificationsTable.id, notificationId));
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
			.from(userNotificationsTable)
			.where(
				and(
					eq(userNotificationsTable.userId, userId),
					eq(userNotificationsTable.isRead, false)
				)
			);
		return result;
	} catch (error) {
		console.error('Error fetching unread notifications for user:', error);
		throw error;
	}
};

export async function getNotificationById(
	notificationId: string
): Promise<SelectUserNotification | null> {
	const [notification] = await db
		.select()
		.from(userNotificationsTable)
		.where(eq(userNotificationsTable.id, notificationId))
		.limit(1);

	return notification || null;
}
