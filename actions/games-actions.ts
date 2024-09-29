'use server';

import {
	createGame,
	getGamesByHost,
	getGameById,
	updateGame,
	deleteGame,
	getGamesByLocation,
	getAllGames,
} from '@/db/queries/games-queries';
import { InsertGame } from '@/db/schema/games-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import {
	requireAuth,
	isUserHost,
	hasUserJoinedGame,
	isUserAdmin,
} from '@/lib/auth-utils';

// Action to create a new game
export async function createGameAction(data: InsertGame): Promise<ActionState> {
	try {
		const hostId = await requireAuth();
		await createGame({ ...data, hostId });
		revalidatePath('/games');
		return {
			status: 'success',
			message: 'Game created successfully',
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to create game' };
	}
}

// Action to get all games hosted by a specific user
export async function getGamesByHostAction(
	hostId: string
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		if (userId !== hostId) {
			return {
				status: 'error',
				message: 'You are not authorized to view this game',
			};
		}
		const games = await getGamesByHost(hostId);
		return {
			status: 'success',
			message: 'Games retrieved successfully',
			data: games,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve games' };
	}
}

// Action to get a specific game by ID
export async function getGameByIdAction(gameId: string): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const joinedGame = await hasUserJoinedGame(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!joinedGame || !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to view this game',
			};
		}
		const game = await getGameById(gameId);

		return {
			status: 'success',
			message: 'Game retrieved successfully',
			data: game,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve game' };
	}
}

// Action to update a game's details
export async function updateGameAction(
	gameId: string,
	data: Partial<InsertGame>
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const isHost = await isUserHost(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!isHost || !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to update this game',
			};
		}
		await updateGame(gameId, data);
		revalidatePath(`/games/${gameId}`);
		return {
			status: 'success',
			message: 'Game updated successfully',
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to update game' };
	}
}

// Action to delete a game
export async function deleteGameAction(gameId: string): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const isHost = await isUserHost(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!isHost || !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to delete this game',
			};
		}
		await deleteGame(gameId);
		revalidatePath('/games');
		return {
			status: 'success',
			message: 'Game deleted successfully',
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to delete game' };
	}
}

// Action to get games by location (for joiners searching within a location radius)
export async function getGamesByLocationAction(
	location: string
): Promise<ActionState> {
	try {
		await requireAuth();
		const games = await getGamesByLocation(location);
		return {
			status: 'success',
			message: 'Games retrieved successfully',
			data: games,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve games by location' };
	}
}

// Action to get all games (for general browsing or admin purposes)
export async function getAllGamesAction(): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		await isUserAdmin(userId);
		const games = await getAllGames();
		return {
			status: 'success',
			message: 'All games retrieved successfully',
			data: games,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve all games' };
	}
}
