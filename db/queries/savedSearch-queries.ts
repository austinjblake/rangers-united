import { db } from '../db';
import { savedSearchesTable } from '@/db/schema/savedSearch-schema';
import { profilesTable } from '@/db/schema/profiles-schema';
import { eq, and, gte, inArray } from 'drizzle-orm';
import { getGamesByLocationRadius } from './games-queries';

export async function getSavedSearchesWithGames() {
	const savedSearches = await db
		.select()
		.from(savedSearchesTable)
		.innerJoin(
			profilesTable,
			eq(savedSearchesTable.userId, profilesTable.userId)
		);

	const searchResults = await Promise.all(
		savedSearches.map(async (search) => {
			const games = await getGamesByLocationRadius(
				search.saved_searches.locationId,
				search.saved_searches.userId,
				search.saved_searches.radius || 0
			);

			const filteredGames = games?.filter(
				(game) =>
					new Date(game.createdAt || '') >
					new Date(search.saved_searches.updatedAt || '')
			);

			return { ...search, games: filteredGames };
		})
	);

	return searchResults.filter((result) => result.games?.length > 0);
}

export async function updateSavedSearchTimestamps(searchIds: string[]) {
	return await db
		.update(savedSearchesTable)
		.set({ updatedAt: new Date() })
		.where(inArray(savedSearchesTable.id, searchIds));
}
