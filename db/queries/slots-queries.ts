'use server';

import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db';
import { gameSlotsTable, InsertGameSlot } from '../schema/slots-schema';
import { gamesTable } from '../schema/games-schema';
import { locationsTable } from '../schema/locations-schema';

// 1. Insert a new game slot (create a slot as a host or joiner)
export const createGameSlot = async (slotData: InsertGameSlot) => {
	try {
		const [newSlot] = await db
			.insert(gameSlotsTable)
			.values(slotData)
			.returning({ id: gameSlotsTable.id });
		console.log('Game slot created successfully');
		return newSlot.id;
	} catch (error) {
		console.error('Error creating game slot:', error);
		throw error;
	}
};

// 2. Select all game slots for a specific user
export const getGameSlotsByUser = async (userId: string) => {
	try {
		// Join gameSlotsTable with gamesTable and locationsTable to select necessary fields
		const result = await db
			.select({
				slotId: gameSlotsTable.id,
				isHost: gameSlotsTable.isHost,
				joinerLocationId: gameSlotsTable.joinerLocationId,
				gameLocationId: gamesTable.locationId, // Game location from gamesTable
				gameDate: gamesTable.date, // Other fields you may need from gamesTable
				gameId: gamesTable.id,
				locationIsPrivate: locationsTable.isPrivate, // Fetching private from locationsTable
				locationIsFLGS: locationsTable.isFLGS, // Fetching FLGS from locationsTable
			})
			.from(gameSlotsTable)
			.leftJoin(gamesTable, eq(gameSlotsTable.gameId, gamesTable.id)) // Join gameSlots with games
			.leftJoin(locationsTable, eq(gamesTable.locationId, locationsTable.id)) // Join locationsTable to get location details
			.where(eq(gameSlotsTable.userId, userId)); // Filter by userId

		return result;
	} catch (error) {
		console.error('Error fetching game slots for user:', error);
		throw error;
	}
};

// 3. Select all slots for a specific game (for host/other players)
export const getGameSlotsByGameId = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(gameSlotsTable)
			.where(eq(gameSlotsTable.gameId, gameId));
		return result;
	} catch (error) {
		console.error('Error fetching game slots for game:', error);
		throw error;
	}
};

// 4. Update a game slot (e.g., update time or location by host)
export const updateGameSlot = async (
	slotId: string,
	updatedData: Partial<InsertGameSlot>
) => {
	try {
		await db
			.update(gameSlotsTable)
			.set(updatedData)
			.where(eq(gameSlotsTable.id, slotId));
		console.log('Game slot updated successfully');
	} catch (error) {
		console.error('Error updating game slot:', error);
		throw error;
	}
};

// 5. Delete a game slot (e.g., if a user cancels their slot)
export const deleteGameSlot = async (slotId: string) => {
	try {
		await db.delete(gameSlotsTable).where(eq(gameSlotsTable.id, slotId));
		console.log('Game slot deleted successfully');
	} catch (error) {
		console.error('Error deleting game slot:', error);
		throw error;
	}
};

// 6. Check if a user is a host for a specific game
export const isUserHostForGame = async (userId: string, gameId: string) => {
	try {
		const result = await db
			.select()
			.from(gameSlotsTable)
			.where(
				and(
					eq(gameSlotsTable.userId, userId),
					eq(gameSlotsTable.gameId, gameId),
					eq(gameSlotsTable.isHost, true)
				)
			);

		return result.length > 0;
	} catch (error) {
		console.error('Error checking if user is host for game:', error);
		throw error;
	}
};

// 7. Get all game slots with a specific location (for location-based search)
export const getGameSlotsByLocation = async (location: string) => {
	try {
		const result = await db
			.select()
			.from(gameSlotsTable)
			.where(eq(gameSlotsTable.location, location));
		return result;
	} catch (error) {
		console.error('Error fetching game slots by location:', error);
		throw error;
	}
};

// 8. Check if a user has reached the maximum number of slots (5)
export const hasUserReachedMaxSlots = async (
	userId: string
): Promise<boolean> => {
	try {
		const userSlots = await db
			.select({ count: sql<number>`count(*)` })
			.from(gameSlotsTable)
			.where(eq(gameSlotsTable.userId, userId));

		return userSlots[0].count >= 5;
	} catch (error) {
		console.error('Error checking user slot count:', error);
		throw error;
	}
};

// 9. Check if a game slot belongs to a specific user
export const isGameSlotOwnedByUser = async (
	slotId: string,
	userId: string
): Promise<boolean> => {
	try {
		const result = await db
			.select()
			.from(gameSlotsTable)
			.where(
				and(eq(gameSlotsTable.id, slotId), eq(gameSlotsTable.userId, userId))
			);

		return result.length > 0;
	} catch (error) {
		console.error('Error checking if game slot belongs to user:', error);
		throw error;
	}
};
