import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db';
import { messagesTable, InsertMessage } from '../schema/messages-schema';

// 1. Insert a new message (e.g., player or host sends a message in the game chat)
export const createMessage = async (messageData: InsertMessage) => {
	try {
		await db.insert(messagesTable).values(messageData);
		console.log('Message created successfully');
	} catch (error) {
		console.error('Error creating message:', error);
		throw error;
	}
};

// 2. Get all messages for a specific game (visible to joiners)
export const getMessagesByGameId = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(messagesTable)
			.where(
				and(
					eq(messagesTable.gameId, gameId),
					eq(messagesTable.isVisibleToJoiners, true)
				)
			);
		return result;
	} catch (error) {
		console.error('Error fetching messages for game:', error);
		throw error;
	}
};

// 3. Get all messages for a specific game (including hidden ones, for the host)
export const getAllMessagesByGameIdForHost = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(messagesTable)
			.where(eq(messagesTable.gameId, gameId));
		return result;
	} catch (error) {
		console.error('Error fetching all messages for game (host view):', error);
		throw error;
	}
};

// 4. Update a message (edit message content)
export const updateMessage = async (
	messageId: string,
	newMessage: string,
	editedAt: Date
) => {
	try {
		await db
			.update(messagesTable)
			.set({ message: newMessage, editedAt: editedAt })
			.where(eq(messagesTable.id, messageId));
		console.log('Message updated successfully');
	} catch (error) {
		console.error('Error updating message:', error);
		throw error;
	}
};

export const deleteMessage = async (messageId: string) => {
	try {
		await db
			.update(messagesTable)
			.set({ isDeleted: true })
			.where(eq(messagesTable.id, messageId));
		console.log('Message deleted successfully');
	} catch (error) {
		console.error('Error deleting message:', error);
		throw error;
	}
};

// 6. Mark all messages from a user as "from ex-member" after they leave the game
export const markMessagesAsFromExMember = async (
	gameId: string,
	senderId: string
) => {
	try {
		await db
			.update(messagesTable)
			.set({ isFromExMember: true, isVisibleToJoiners: false })
			.where(
				and(
					eq(messagesTable.gameId, gameId),
					eq(messagesTable.senderId, senderId)
				)
			);
		console.log('Messages marked as from ex-member successfully');
	} catch (error) {
		console.error('Error marking messages as from ex-member:', error);
		throw error;
	}
};

// Check if a message is sent by a specific user
export const isMessageSentByUser = async (
	messageId: string,
	userId: string
) => {
	try {
		const result = await db
			.select({ count: sql<number>`count(*)` })
			.from(messagesTable)
			.where(
				and(eq(messagesTable.id, messageId), eq(messagesTable.senderId, userId))
			);

		return result[0].count > 0;
	} catch (error) {
		console.error('Error checking if message is sent by user:', error);
		throw error;
	}
};
