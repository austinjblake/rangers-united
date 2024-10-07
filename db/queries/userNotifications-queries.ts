import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import {
	userNotificationsTable,
	InsertUserNotification,
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
			.where(eq(userNotificationsTable.userId, userId))
			.orderBy(desc(userNotificationsTable.createdAt));
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

// check if notification belongs to user
export const checkNotificationBelongsToUser = async (
	notificationId: string,
	userId: string
) => {
	try {
		const result = await db
			.select()
			.from(userNotificationsTable)
			.where(
				and(
					eq(userNotificationsTable.id, notificationId),
					eq(userNotificationsTable.userId, userId)
				)
			);
		return result.length > 0;
	} catch (error) {
		console.error('Error checking notification belongs to user:', error);
		throw error;
	}
};
