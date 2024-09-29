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

// Action to create a new game slot
export async function createGameSlotAction(
	data: InsertGameSlot
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const hasReachedMaxSlots = await hasUserReachedMaxSlots(user);
		if (!isAdmin || hasReachedMaxSlots) {
			throw new Error('User does not have permission to create game slots');
		}
		const newGameSlot = await createGameSlot(data);
		revalidatePath('/game-slots');
		return {
			status: 'success',
			message: 'Game slot created successfully',
			data: newGameSlot,
		};
	} catch (error) {
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
		if (!isAdmin || !belongsToUser) {
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
export async function getGameSlotsByUserIdAction(
	userId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		if (!isAdmin || userId !== user) {
			throw new Error('User does not have permission to get this game slot');
		}
		const gameSlots = await getGameSlotsByUser(userId);
		return {
			status: 'success',
			message: 'Game slots retrieved successfully',
			data: gameSlots,
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
		if (!isAdmin || !belongsToUser) {
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
	gameSlotId: string
): Promise<ActionState> {
	try {
		const user = await requireAuth();
		const isAdmin = await isUserAdmin(user);
		const belongsToUser = await isGameSlotOwnedByUser(gameSlotId, user);
		if (!isAdmin || !belongsToUser) {
			throw new Error('User does not have permission to delete this game slot');
		}
		await deleteGameSlot(gameSlotId);
		revalidatePath('/game-slots');
		return { status: 'success', message: 'Game slot deleted successfully' };
	} catch (error) {
		return { status: 'error', message: 'Failed to delete game slot' };
	}
}
