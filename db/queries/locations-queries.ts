import { db } from '@/db/db';
import { eq, sql } from 'drizzle-orm';
import { InsertLocation, locationsTable } from '@/db/schema/locations-schema';

// Insert a new location
export const insertLocation = async (locationData: InsertLocation) => {
	try {
		await db.insert(locationsTable).values(locationData);
		console.log('Location created successfully');
	} catch (error) {
		console.error('Error inserting location:', error);
		throw error;
	}
};

// Get all locations for a specific user
export const fetchLocationsByUserId = async (userId: string) => {
	try {
		const result = await db
			.select()
			.from(locationsTable)
			.where(eq(locationsTable.userId, userId));
		return result;
	} catch (error) {
		console.error('Error fetching locations by user ID:', error);
		throw error;
	}
};

// Get a location by ID
export const fetchLocationById = async (locationId: string) => {
	try {
		const result = await db
			.select()
			.from(locationsTable)
			.where(eq(locationsTable.id, locationId));
		return result;
	} catch (error) {
		console.error('Error fetching location by ID:', error);
		throw error;
	}
};

// Update a location
export const modifyLocation = async (
	locationId: string,
	updatedData: Partial<InsertLocation>
) => {
	try {
		await db
			.update(locationsTable)
			.set(updatedData)
			.where(eq(locationsTable.id, locationId));
		console.log('Location updated successfully');
	} catch (error) {
		console.error('Error updating location:', error);
		throw error;
	}
};

// Delete a location
export const removeLocation = async (locationId: string) => {
	try {
		console.log(locationId, 'delete query');
		await db.delete(locationsTable).where(eq(locationsTable.id, locationId));
		console.log('Location deleted successfully');
	} catch (error) {
		console.error('Error deleting location:', error);
		throw error;
	}
};

// Get all public FLGS locations
export const fetchAllFLGSLocations = async () => {
	try {
		const result = await db
			.select()
			.from(locationsTable)
			.where(eq(locationsTable.isFLGS, true));
		return result;
	} catch (error) {
		console.error('Error fetching FLGS locations:', error);
		throw error;
	}
};

// Get locations by proximity
export const fetchLocationsByProximity = async (
	userLatitude: number,
	userLongitude: number,
	radius: number
) => {
	try {
		const query = sql`
      SELECT *, ST_Distance(
        ST_SetSRID(ST_MakePoint(${userLongitude}, ${userLatitude}), 4326),
        ST_SetSRID(location::geography, 4326)
      ) AS distance
      FROM locations
      WHERE ST_DWithin(
        ST_SetSRID(ST_MakePoint(${userLongitude}, ${userLatitude}), 4326),
        ST_SetSRID(location::geography, 4326), ${radius}
      )
      ORDER BY distance;
    `;
		const result = await db.execute(query);
		return result;
	} catch (error) {
		console.error('Error fetching locations by proximity:', error);
		throw error;
	}
};
