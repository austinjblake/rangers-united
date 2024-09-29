import { eq } from 'drizzle-orm';
import { db } from '../db'; // Assuming you have a database connection instance
import { Games, InsertGame } from '../schema/games-schema';

// 1. Create a new game (host creates a game with location and date)
export const createGame = async (gameData: InsertGame) => {
	try {
		await db.insert(Games).values(gameData);
		console.log('Game created successfully');
	} catch (error) {
		console.error('Error creating game:', error);
		throw error;
	}
};

// 2. Get all games hosted by a specific user (host)
export const getGamesByHost = async (hostId: string) => {
	try {
		const result = await db
			.select()
			.from(Games)
			.where(eq(Games.hostId, hostId));
		return result;
	} catch (error) {
		console.error('Error fetching games for host:', error);
		throw error;
	}
};

// 3. Get a game by ID (e.g., for viewing game details or joining)
export const getGameById = async (gameId: string) => {
	try {
		const result = await db.select().from(Games).where(eq(Games.id, gameId));
		return result;
	} catch (error) {
		console.error('Error fetching game by ID:', error);
		throw error;
	}
};

// 4. Update a game (host updates game details such as location or date)
export const updateGame = async (
	gameId: string,
	updatedData: Partial<InsertGame>
) => {
	try {
		await db.update(Games).set(updatedData).where(eq(Games.id, gameId));
		console.log('Game updated successfully');
	} catch (error) {
		console.error('Error updating game:', error);
		throw error;
	}
};

// 5. Delete a game (host deletes the game)
export const deleteGame = async (gameId: string) => {
	try {
		await db.delete(Games).where(eq(Games.id, gameId));
		console.log('Game deleted successfully');
	} catch (error) {
		console.error('Error deleting game:', error);
		throw error;
	}
};

// 6. Get games by location (for joiners searching within a location radius)
export const getGamesByLocation = async (location: string) => {
	try {
		const result = await db
			.select()
			.from(Games)
			.where(eq(Games.location, location));
		return result;
	} catch (error) {
		console.error('Error fetching games by location:', error);
		throw error;
	}
};

// 7. Get all games (for general browsing or admin purposes)
export const getAllGames = async () => {
	try {
		const result = await db.select().from(Games);
		return result;
	} catch (error) {
		console.error('Error fetching all games:', error);
		throw error;
	}
};
