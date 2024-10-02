'use server';

import {
	insertLocation,
	fetchLocationsByUserId,
	fetchLocationById,
	modifyLocation,
	removeLocation,
	fetchAllFLGSLocations,
	fetchLocationsByProximity,
} from '@/db/queries/locations-queries';
import { InsertLocation, SelectLocation } from '@/db/schema/locations-schema';
import { requireAuth, isUserAdmin } from '@/lib/auth-utils';
import { geocodeAddress } from '@/lib/geocode';
import { v4 as uuidv4 } from 'uuid';
import { findNearbyFLGS } from '@/lib/places';

// Function to format lat/lon into PostGIS-compatible POINT
const formatGeographyPoint = (lat: number, lon: number): string => {
	return `POINT(${lon} ${lat})`;
};

// 1. Create a new location
export const createLocation = async (locationData: InsertLocation) => {
	try {
		const userId = await requireAuth();
		// Step 1: Geocode the address using a geocoding API to get lat/lon
		const { lat, lon } = await geocodeAddress(locationData.location);
		// Step 2: Format the lat/lon into a geography POINT
		const geoPoint = formatGeographyPoint(lat, lon);
		const newLocationData = {
			...locationData,
			userId,
			location: geoPoint,
			id: uuidv4(),
		};

		await insertLocation(newLocationData);
		return { status: 'success', message: 'Location created successfully' };
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
};

// 2. Get all locations for a specific user
export const getLocationsByUserId = async () => {
	try {
		const userId = await requireAuth();
		const locations = await fetchLocationsByUserId(userId);
		return locations;
	} catch (error) {
		console.error('Error fetching locations for user:', error);
		throw error;
	}
};

// 3. Get a location by ID
export const getLocationById = async (locationId: string) => {
	try {
		const userId = await requireAuth();
		const location = await fetchLocationById(locationId);

		if (
			!location ||
			(location[0].userId !== userId && !(await isUserAdmin(userId)))
		) {
			return {
				status: 'error',
				message: 'You are not authorized to view this location',
			};
		}

		return location;
	} catch (error) {
		console.error('Error fetching location by ID:', error);
		throw error;
	}
};

// 4. Update a location
export const updateLocation = async (
	locationId: string,
	updatedData: Partial<InsertLocation>
) => {
	try {
		const userId = await requireAuth();
		const location = await fetchLocationById(locationId);

		if (
			!location ||
			(location[0].userId !== userId && !(await isUserAdmin(userId)))
		) {
			return {
				status: 'error',
				message: 'You are not authorized to update this location',
			};
		}

		await modifyLocation(locationId, updatedData);
		return { status: 'success', message: 'Location updated successfully' };
	} catch (error) {
		console.error('Error updating location:', error);
		throw error;
	}
};

// 5. Delete a location
export const deleteLocation = async (locationId: string) => {
	try {
		const userId = await requireAuth();
		const location = await fetchLocationById(locationId);

		if (
			!location ||
			(location[0].userId !== userId && !(await isUserAdmin(userId)))
		) {
			return {
				status: 'error',
				message: 'You are not authorized to delete this location',
			};
		}
		await removeLocation(locationId);
		return { status: 'success', message: 'Location deleted successfully' };
	} catch (error) {
		console.error('Error deleting location:', error);
		throw error;
	}
};

// 6. Get all public FLGS locations
export const getAllFLGSLocations = async () => {
	try {
		const locations = await fetchAllFLGSLocations();
		return locations;
	} catch (error) {
		console.error('Error fetching FLGS locations:', error);
		throw error;
	}
};

// 7. Get locations by proximity
export const getLocationsByProximity = async (
	userLatitude: number,
	userLongitude: number,
	radius: number
) => {
	try {
		const locations = await fetchLocationsByProximity(
			userLatitude,
			userLongitude,
			radius
		);
		return locations;
	} catch (error) {
		console.error('Error fetching locations by proximity:', error);
		throw error;
	}
};

// 8. Get nearby Friendly Local Game Stores
export const getNearbyFLGS = async (address: string, radius: number) => {
	try {
		const results = await findNearbyFLGS(address, radius);
		return { status: 'success', data: results };
	} catch (error) {
		console.error('Error fetching nearby FLGS:', error);
		return { status: 'error', message: 'Failed to fetch nearby FLGS' };
	}
};

// 9. Geolocate a location that won't be saved to the database
export const geoLocateLocation = async (locationData: SelectLocation) => {
	try {
		const userId = await requireAuth();
		// Step 1: Geocode the address using a geocoding API to get lat/lon
		const { lat, lon } = await geocodeAddress(locationData.location);
		// Step 2: Format the lat/lon into a geography POINT
		const geoPoint = formatGeographyPoint(lat, lon);
		const newLocationData = {
			...locationData,
			userId,
			location: geoPoint,
			id: uuidv4(),
		};

		return { status: 'success', data: newLocationData };
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
};
