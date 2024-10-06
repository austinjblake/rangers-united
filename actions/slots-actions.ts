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
		const id = uuidv4();
		const newGameSlotData = {
			...data,
			id,
			userId: user,
			gameId: data.gameId as string,
		};
		console.log('new game slot data', newGameSlotData);
		const newGameSlot = await createGameSlot(newGameSlotData);
		console.log('new game slot', newGameSlot);
		revalidatePath('/game-slots');

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

// Action to retrieve a game slot by ID
export async function getGameSlotByIdAction(
	gameSlotId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const belongsToUser = await isGameSlotOwnedByUser(gameSlotId, user);
		if (!isAdmin && !belongsToUser) {
			throw new Error('User does not have permission to get this game slot');
		}
		const gameSlot = await getGameSlotsByGameId(gameSlotId);
		return {
			status: 'success',
			message: 'Game slot retrieved successfully',
			data: gameSlot,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to get game slot' };
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
		return { status: 'success', message: 'Game slot deleted successfully' };
	} catch (error) {
		return { status: 'error', message: 'Failed to delete game slot' };
	}
}
