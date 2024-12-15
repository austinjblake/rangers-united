import {
	getSavedSearchesWithGames,
	updateSavedSearchTimestamps,
} from '@/db/queries/savedSearch-queries';
import sgMail from '@sendgrid/mail';

export default async function handleScheduledSearch() {
	try {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

		const searchResults = await getSavedSearchesWithGames();
		const searchIds = searchResults.map((result) => result.saved_searches.id);

		for (const result of searchResults) {
			const msg = {
				to: result.profiles.email || '',
				from: process.env.SENDGRID_FROM_EMAIL!,
				subject: 'New Games Available in Your Search Area',
				html: formatGamesEmailBody(result.games),
			};

			await sgMail.send(msg);
		}

		await updateSavedSearchTimestamps(searchIds);
	} catch (error) {
		console.error('Error running saved search:', error);
	}
}

function formatGamesEmailBody(games: any[]): string {
	return `
    <h1>New Games Found in Your Area</h1>
    <div>
      ${games
				.map(
					(game) => `
        <div>
          <h2>${game.title}</h2>
          <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
          <p>Location: ${game.location}</p>
          <p><a href="https://www.rangersunited.com/games/${
						game.gameId
					}">View Game Details</a></p>
        </div>
      `
				)
				.join('')}
    </div>
  `;
}
