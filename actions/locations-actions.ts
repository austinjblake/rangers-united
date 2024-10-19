'use server';

import {
	insertLocation,
	fetchLocationsByUserId,
	fetchLocationById,
	modifyLocation,
	removeLocation,
	fetchAllFLGSLocations,
	fetchLocationsByProximity,
	isLocationInUse,
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

//  Create a new location
export const createLocationAction = async (locationData: InsertLocation) => {
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
		return {
			status: 'success',
			message: 'Location created successfully',
			data: newLocationData,
		};
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
};

//  Get all locations for a specific user
export const getLocationsByUserIdAction = async () => {
	try {
		const userId = await requireAuth();
		const locations = await fetchLocationsByUserId(userId);
		return locations;
	} catch (error) {
		console.error('Error fetching locations for user:', error);
		throw error;
	}
};

//  Get a location by ID
export const getLocationByIdAction = async (locationId: string) => {
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

		return { status: 'success', data: location };
	} catch (error) {
		console.error('Error fetching location by ID:', error);
		throw error;
	}
};

//  Delete a location
export const deleteLocationAction = async (locationId: string) => {
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
		const locationUsed = await isLocationInUse(locationId);
		if (locationUsed) {
			return {
				status: 'error',
				message: 'Location is currently in use',
			};
		}
		await removeLocation(locationId);
		return { status: 'success', message: 'Location deleted successfully' };
	} catch (error) {
		console.error('Error deleting location:', error);
		throw error;
	}
};

//  Get nearby Friendly Local Game Stores
export const getNearbyFLGSAction = async (address: string, radius: number) => {
	try {
		const results = await findNearbyFLGS(address, radius);
		return { status: 'success', data: results };
	} catch (error) {
		console.error('Error fetching nearby FLGS:', error);
		return { status: 'error', message: 'Failed to fetch nearby FLGS' };
	}
};

// Geolocate a location that won't be saved to the database
export const geoLocateLocationAction = async (locationData: SelectLocation) => {
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
			id: '',
		};

		return { status: 'success', data: newLocationData };
	} catch (error) {
		console.error('Error creating location:', error);
		throw error;
	}
};
