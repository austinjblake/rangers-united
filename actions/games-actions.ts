'use server';

import {
	createGame,
	getGameById,
	updateGame,
	deleteGame,
	getGamesByLocationRadius,
	getAllGames,
	getGameInfoForSlot,
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
import { v4 as uuidv4 } from 'uuid';
import { createLocation } from './locations-actions';
import { SelectLocation } from '@/db/schema/locations-schema';
import { metersToMiles, milesToMeters } from '@/lib/places';
import { createNotificationAction } from './gameNotifications-actions';
import { deleteNotificationsForGame } from './userNotifications-actions';

// Action to create a new game
export async function createGameAction(
	data: Omit<Partial<InsertGame>, 'id' | 'hostId'>,
	selectedLocation: SelectLocation
): Promise<ActionState> {
	try {
		const hostId = await requireAuth();
		const id = uuidv4();
		const gameData = { ...data, hostId, id };
		let locId = selectedLocation.id;

		// if location does not have an id save it to the db
		if (selectedLocation.id === '') {
			const locationObj = {
				id: '',
				name: selectedLocation.name,
				location: selectedLocation.readableAddress, // this will be geolocated in createLocation
				readableAddress: selectedLocation.readableAddress,
				userId: hostId,
				isFLGS: selectedLocation.isFLGS,
				isPrivate: selectedLocation.isPrivate,
				temporary: true,
			};
			const newLocation = await createLocation(locationObj);
			locId = newLocation.data.id;
		}

		const newGameData = {
			...gameData,
			locationId: locId,
		};
		console.log('Creating game', newGameData);
		await createGame(newGameData);
		revalidatePath('/games');
		await createNotificationAction({
			id: uuidv4(),
			gameId: newGameData.id,
			notification: 'Host created a new game',
			createdAt: new Date(),
		});

		return {
			status: 'success',
			message: 'Game created successfully',
			data: newGameData,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to create game' };
	}
}

// Action to get a specific game by ID
export async function getGameByIdAction(gameId: string): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const joinedGame = await hasUserJoinedGame(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!joinedGame && !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to view this game',
			};
		}
		const result = await getGameById(gameId);
		const game = result[0];
		const editAuth = userId === game.hostId || isAdmin;
		return {
			status: 'success',
			message: 'Game retrieved successfully',
			data: { ...game, editAuth },
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve game' };
	}
}

// Action to update a game's details
export async function updateGameAction(
	gameId: string,
	data: { location?: SelectLocation; date?: Date }
): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const isHost = await isUserHost(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!isHost && !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to update this game',
			};
		}

		let updateData = { locationId: data.location?.id, date: data.date };

		if (data.location && data.location.id === '') {
			const locationObj = {
				id: '',
				name: data.location.name,
				location: data.location.readableAddress,
				readableAddress: data.location.readableAddress,
				userId,
				isFLGS: data.location.isFLGS,
				isPrivate: data.location.isPrivate,
				temporary: true,
			};
			const newLocation = await createLocation(locationObj);
			updateData.locationId = newLocation.data.id;
		}

		await updateGame(gameId, updateData);
		revalidatePath(`/games/${gameId}`);
		await createNotificationAction({
			id: uuidv4(),
			gameId,
			notification: 'Host updated game location/time details',
			createdAt: new Date(),
		});
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
		if (!isHost && !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to delete this game',
			};
		}
		await deleteNotificationsForGame(gameId, userId);
		await deleteGame(gameId);
		console.log('Deleting game', gameId);
		return {
			status: 'success',
			message: 'Game deleted successfully',
		};
	} catch (error) {
		console.error('Error deleting game:', error);
		return { status: 'error', message: 'Failed to delete game' };
	}
}

// Action to get games by location (for joiners searching within a location radius)
export async function getGamesByLocationAction(
	location: string,
	radius: number
): Promise<ActionState> {
	try {
		const meters = milesToMeters(radius);
		const userId = await requireAuth();
		const result = await getGamesByLocationRadius(location, userId, meters);
		const gamesWithDistanceInMiles = result.map((game) => ({
			...game,
			distance: metersToMiles(Number(game.distance)),
		}));
		return {
			status: 'success',
			message: 'Games retrieved successfully',
			data: gamesWithDistanceInMiles,
		};
	} catch (error) {
		console.error('Error fetching games by location:', error);
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

// Action to get a specific game by ID
export async function getAllGameInfo(gameId: string): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const joinedGame = await hasUserJoinedGame(userId, gameId);
		const isAdmin = await isUserAdmin(userId);
		if (!joinedGame && !isAdmin) {
			return {
				status: 'error',
				message: 'You are not authorized to view this game',
			};
		}
		const result = await getGameInfoForSlot(userId, gameId);
		const game = result[0];
		const gameWithDistanceInMiles = {
			...game,
			distance: metersToMiles(Number(game.distance)),
		};
		return {
			status: 'success',
			message: 'Game retrieved successfully',
			data: gameWithDistanceInMiles,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to retrieve game' };
	}
}
