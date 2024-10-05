import { config } from 'dotenv';
import { geocodeAddress } from './geocode';

config({ path: '.env.local' });

const googleApiKey = process.env.GOOGLE_MAPS_GEOCODING_API_KEY;

export const milesToMeters = (miles: number): number => {
	const metersPerMile = 1609.34;
	return miles * metersPerMile;
};

export const metersToMiles = (meters: number): number => {
	const milesPerMeter = 0.000621371;
	return meters * milesPerMeter;
};

export async function findNearbyFLGS(address: string, radius: number) {
	try {
		const meters = milesToMeters(radius);
		const { lat, lon } = await geocodeAddress(address);

		const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Friendly+Local+Game+Store+OR+board+game+store&location=${lat},${lon}&radius=${meters}&key=${googleApiKey}`;

		const response = await fetch(placesUrl);
		const data = await response.json();

		return data;
	} catch (error) {
		console.error('Error finding nearby FLGS:', error);
		throw new Error('Error finding nearby FLGS');
	}
}
