import { eq, sql, and, ne } from 'drizzle-orm';
import { db } from '../db'; // Assuming you have a database connection instance
import { gamesTable, InsertGame } from '../schema/games-schema';
import { locationsTable } from '../schema/locations-schema';
import { profilesTable } from '../schema/profiles-schema';
import { gameSlotsTable } from '../schema';

// 1. Create a new game (host creates a game with location and date)
export const createGame = async (gameData: InsertGame) => {
	try {
		await db.insert(gamesTable).values(gameData);
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
			.from(gamesTable)
			.where(eq(gamesTable.hostId, hostId));
		return result;
	} catch (error) {
		console.error('Error fetching games for host:', error);
		throw error;
	}
};

// 3. Get a game by ID (e.g., for viewing game details or joining)
export const getGameById = async (gameId: string) => {
	try {
		const result = await db
			.select()
			.from(gamesTable)
			.where(eq(gamesTable.id, gameId));
		return result;
	} catch (error) {
		console.error('Error fetching game by ID:', error);
		throw error;
	}
};

// 4. Update a game (host updates game details such as location or date)
export const updateGame = async (
	gameId: string,
	updateData: { locationId?: string; date?: Date }
) => {
	try {
		const query = db
			.update(gamesTable)
			.set(updateData)
			.where(eq(gamesTable.id, gameId));

		const result = await query;
		return result;
	} catch (error) {
		console.error('Error updating game:', error);
		throw error;
	}
};

// 5. Delete a game (host deletes the game)
export const deleteGame = async (gameId: string) => {
	try {
		await db.delete(gamesTable).where(eq(gamesTable.id, gameId));
		console.log('Game deleted successfully');
	} catch (error) {
		console.error('Error deleting game:', error);
		throw error;
	}
};

// 6. Get games by location (for joiners searching within a location radius)
export const getGamesByLocationRadius = async (
	location: string, // Could be either 'POINT(lat, lon)' or WKB format
	userId: string,
	radius: number
) => {
	try {
		let userPoint: any;

		// Check if the location is in 'POINT(lon, lat)' format
		if (location.startsWith('POINT')) {
			// Extract lat and lon from the 'POINT(lon, lat)' format
			const [lon, lat] = location
				.replace('POINT(', '')
				.replace(')', '')
				.split(' ')
				.map(parseFloat);
			// Create a point using the provided lat, lon
			userPoint = sql`ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)::geography`;
		} else {
			// Assume the location is already in WKB format (e.g., '0101...')
			userPoint = sql`${location}::geography`;
		}
		// Now search for games within the given radius from the user's point
		const result = await db
			.select({
				gameId: gamesTable.id,
				locationId: gamesTable.locationId,
				date: gamesTable.date,
				createdAt: gamesTable.createdAt,
				isPrivate: locationsTable.isPrivate,
				isFLGS: locationsTable.isFLGS,
				locationName: locationsTable.name,
				hostUsername: profilesTable.username,
				// Calculate and return the distance in meters
				distance:
					sql`ST_Distance(${locationsTable.location}::geography, ${userPoint})`.as(
						'distance'
					),
				// Count the number of joiners for the game
				joinerCount: sql`COUNT(${gameSlotsTable.userId})`.as('joinerCount'),
				// Check if the user has already joined this game
				hasJoined: sql`EXISTS (
					SELECT 1 FROM ${gameSlotsTable}
					WHERE ${gameSlotsTable.gameId} = ${gamesTable.id}
					AND ${gameSlotsTable.userId} = ${userId}
				)`.as('hasJoined'),
			})
			.from(gamesTable)
			.leftJoin(locationsTable, eq(gamesTable.locationId, locationsTable.id))
			.leftJoin(profilesTable, eq(gamesTable.hostId, profilesTable.userId)) // Join profilesTable to fetch the host's username
			.leftJoin(gameSlotsTable, eq(gamesTable.id, gameSlotsTable.gameId)) // Join gameSlotsTable to count joiners
			.where(
				and(
					// Use ST_DWithin to find locations within the radius (in meters)
					sql`ST_DWithin(${locationsTable.location}::geography, ${userPoint}, ${radius})`,
					// Exclude games where the user is the host
					ne(gamesTable.hostId, userId)
				)
			)
			.groupBy(
				gamesTable.id,
				locationsTable.id,
				profilesTable.username,
				// Include other fields in the GROUP BY clause
				gamesTable.date,
				gamesTable.createdAt,
				locationsTable.isPrivate,
				locationsTable.isFLGS,
				locationsTable.name
			)
			.orderBy(sql`distance`); // Order by the distance
		return result;
	} catch (error) {
		console.error('Error fetching games by location radius:', error);
		throw error;
	}
};

// 7. Get all games (for general browsing or admin purposes)
export const getAllGames = async () => {
	try {
		const result = await db.select().from(gamesTable);
		return result;
	} catch (error) {
		console.error('Error fetching all games:', error);
		throw error;
	}
};
