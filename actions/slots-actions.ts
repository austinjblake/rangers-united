'use server';

import {
	createGameSlot,
	deleteGameSlot,
	getGameSlotsByGameId,
	getGameSlotsByUser,
	hasUserReachedMaxSlots,
	isGameSlotOwnedByUser,
	updateGameSlot,
} from '@/db/queries/slots-queries';
import { InsertGameSlot } from '@/db/schema/slots-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { requireAuth, isUserAdmin } from '@/lib/auth-utils';
import { v4 as uuidv4 } from 'uuid';
import { metersToMiles } from '@/lib/places';
import { createGameNotificationAction } from './gameNotifications-actions';
import { getProfileByUserId } from '@/db/queries/profiles-queries';
import { checkIfGameIsFull } from '@/db/queries/games-queries';
// Action to create a new game slot
export async function createGameSlotAction(
	data: Omit<Partial<InsertGameSlot>, 'id' | 'userId'>
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const hasReachedMaxSlots = await hasUserReachedMaxSlots(user);
		if (!isAdmin && hasReachedMaxSlots) {
			throw new Error('User does not have permission to create game slots');
		}
		const isGameFull = await checkIfGameIsFull(data.gameId as string);
		if (isGameFull) {
			throw new Error('Game is already full');
		}
		const id = uuidv4();
		const newGameSlotData = {
			...data,
			id,
			userId: user,
			gameId: data.gameId as string,
		};
		const newGameSlot = await createGameSlot(newGameSlotData);
		revalidatePath('/game-slots');
		const userProfile = await getProfileByUserId(user);
		const username = userProfile?.username;
		await createGameNotificationAction({
			id: uuidv4(),
			gameId: data.gameId as string,
			notification: `${username} joined the game`,
			createdAt: new Date(),
		});
		return {
			status: 'success',
			message: 'Game slot created successfully',
			data: newGameSlot,
		};
	} catch (error) {
		console.error('Error creating game slot:', error);
		return { status: 'error', message: 'Failed to create game slot' };
	}
}

// Action to retrieve all game slots for a specific user
export async function getGameSlotsByUserIdAction(): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		if (!userId) {
			throw new Error('User does not have permission to get this game slot');
		}
		const gameSlots = await getGameSlotsByUser(userId);
		// convert distance to miles
		const gameSlotsWithDistanceInMiles = gameSlots.map((slot) => {
			return {
				...slot,
				distance: metersToMiles(slot.distance as number),
			};
		});
		return {
			status: 'success',
			message: 'Game slots retrieved successfully',
			data: gameSlotsWithDistanceInMiles,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to get game slots' };
	}
}

// Action to update a game slot by ID
export async function updateGameSlotAction(
	gameSlotId: string,
	data: Partial<InsertGameSlot>
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const belongsToUser = await isGameSlotOwnedByUser(gameSlotId, user);
		if (!isAdmin && !belongsToUser) {
			throw new Error('User does not have permission to update this game slot');
		}
		const updatedGameSlot = await updateGameSlot(gameSlotId, data);
		revalidatePath('/game-slots');
		return {
			status: 'success',
			message: 'Game slot updated successfully',
			data: updatedGameSlot,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to update game slot' };
	}
}

// Action to delete a game slot by ID
export async function deleteGameSlotAction(
	gameSlotId: string,
	gameId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const belongsToUser = await isGameSlotOwnedByUser(gameSlotId, user);
		if (!isAdmin && !belongsToUser) {
			throw new Error('User does not have permission to delete this game slot');
		}
		await deleteGameSlot(user, gameId);
		revalidatePath('/game-slots');
		const userProfile = await getProfileByUserId(user);
		const username = userProfile?.username;
		await createGameNotificationAction({
			id: uuidv4(),
			gameId,
			notification: `${username} left the game`,
			createdAt: new Date(),
		});
		return { status: 'success', message: 'Game slot deleted successfully' };
	} catch (error) {
		return { status: 'error', message: 'Failed to delete game slot' };
	}
}

// Action to check if a user has reached the maximum number of slots
export async function checkUserSlotsRemaining(): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		if (!userId) {
			throw new Error('User does not have permission to check max slots');
		}
		const hasReachedMaxSlots = await hasUserReachedMaxSlots(userId);
		return {
			status: 'success',
			message: `User has${hasReachedMaxSlots ? '' : ' not'} reached max slots`,
			data: !hasReachedMaxSlots,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to check max slots' };
	}
}
