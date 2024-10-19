'use server';

import {
	createMessage,
	getMessagesByGameId,
	getAllMessagesByGameIdForHost,
	updateMessage,
	deleteMessage,
	markMessagesAsFromExMember,
	isMessageSentByUser,
} from '@/db/queries/messages-queries';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import {
	requireAuth,
	isUserHost,
	hasUserJoinedGame,
	isUserAdmin,
} from '@/lib/auth-utils';
import { v4 as uuidv4 } from 'uuid';

// Action to create a new message
export async function createMessageAction(
	message: string,
	gameId: string
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const joinedGame = await hasUserJoinedGame(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!joinedGame && !isAdmin) {
			throw new Error('User has not joined the game');
		}
		const messageData = {
			id: uuidv4(),
			gameId: gameId,
			senderId: userId,
			createdAt: new Date(),
			message: message,
			isVisibleToJoiners: true,
			isFromExMember: false,
		};
		await createMessage(messageData);
		//revalidatePath(`/games/${gameId}/messages`);
		return {
			status: 'success',
			message: 'Message created successfully',
			data: { newMessageId: messageData.id, senderId: userId },
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to create message' };
	}
}

// Action to update a message (edit by sender)
export async function updateMessageAction(
	messageId: string,
	newMessage: string
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const isSender = await isMessageSentByUser(messageId, userId);
		const isAdmin = await isUserAdmin(userId);
		if (!isSender && !isAdmin) {
			throw new Error('User is not authorized to update this message');
		}
		const editedAt = new Date();
		await updateMessage(messageId, newMessage, editedAt);
		revalidatePath(`/games/messages`);
		return {
			status: 'success',
			message: 'Message updated successfully',
		};
	} catch (error) {
		console.error('Error updating message:', error);
		return { status: 'error', message: 'Failed to update message' };
	}
}

// Action to delete a message (by the sender or the host)
export async function deleteMessageAction(
	messageId: string,
	gameId: string
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const isSender = await isMessageSentByUser(messageId, userId);
		const isAdmin = await isUserAdmin(userId);
		const isHost = await isUserHost(userId, gameId!);
		if (!isSender && !isAdmin && !isHost) {
			throw new Error('User is not authorized to delete this message');
		}
		await deleteMessage(messageId);
		revalidatePath(`/games/messages`);
		return {
			status: 'success',
			message: 'Message deleted successfully',
		};
	} catch (error) {
		console.error('Error deleting message:', error);
		return { status: 'error', message: 'Failed to delete message' };
	}
}

// Action to mark all messages from a user as "from ex-member" after they leave the game
export async function markMessagesAsFromExMemberAction(
	gameId: string,
	senderId: string
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		if (senderId !== userId) {
			throw new Error('User is not the sender');
		}
		await markMessagesAsFromExMember(gameId, senderId);
		revalidatePath(`/games/${gameId}/messages`);
		return {
			status: 'success',
			message: 'Messages marked as from ex-member successfully',
		};
	} catch (error) {
		return {
			status: 'error',
			message: 'Failed to mark messages as from ex-member',
		};
	}
}
