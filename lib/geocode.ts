import { config } from 'dotenv';

config({ path: '.env.local' });

export const geocodeAddress = async (address: string) => {
	const apiKey = process.env.GOOGLE_MAPS_GEOCODING_API_KEY;
	try {
		const response = await fetch(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
				address
			)}&key=${apiKey}`
		);
		const data = await response.json();
		if (data.status === 'ZERO_RESULTS') {
			throw new Error('No results found for the provided address.');
		}
		const location = data.results[0].geometry.location;
		return {
			lat: location.lat,
			lon: location.lng,
		};
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message === 'No results found for the provided address.'
		) {
			throw error;
		}
		console.error('Error geocoding address:', error);
		throw new Error('An error occurred while geocoding the address.');
	}
};
