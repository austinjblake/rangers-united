import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db';
import {
	gameNotificationsTable,
	InsertGameNotification,
	SelectGameNotification,
} from '../schema/gameNotifications-schema';

// 1. Insert a new notification (e.g., notify a user about a game update)
export const createNotification = async (
	notificationData: InsertGameNotification
) => {
	try {
		await db.insert(gameNotificationsTable).values(notificationData);
		console.log('Notification created successfully');
	} catch (error) {
		console.error('Error creating notification:', error);
		throw error;
	}
};

// 6. Get all notifications for a specific game (e.g., for hosts/admins to review)
export const getNotificationsByGameId = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(gameNotificationsTable)
			.where(eq(gameNotificationsTable.gameId, gameId))
			.orderBy(desc(gameNotificationsTable.createdAt)); // Order by newest first
		return result;
	} catch (error) {
		console.error('Error fetching notifications for game:', error);
		throw error;
	}
};

export async function getNotificationById(
	notificationId: string
): Promise<SelectGameNotification | null> {
	const [notification] = await db
		.select()
		.from(gameNotificationsTable)
		.where(eq(gameNotificationsTable.id, notificationId))
		.limit(1);

	return notification || null;
}
