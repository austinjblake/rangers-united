import GameForm from '@/components/game-form';
import { getGameByIdAction } from '@/actions/games-actions';
import { getLocationById } from '@/actions/locations-actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditGamePage({
	params,
}: {
	params: { gameId: string };
}) {
	const { gameId } = params;

	const gameResult = await getGameByIdAction(gameId);

	if (gameResult.status === 'error' || !gameResult.data) {
		notFound();
	}

	const game = gameResult.data;

	const locationResult = await getLocationById(game.locationId);

	if (locationResult.status === 'error' || !locationResult.data) {
		notFound();
	}

	const location = locationResult.data[0];

	// Check if the current user is the host of the game
	if (!game.editAuth) {
		return (
			<div className='flex flex-col items-center justify-center min-h-screen'>
				<h1 className='text-4xl font-bold mb-4'>Not Authorized</h1>
				<p className='mb-4'>You are not authorized to edit this game.</p>
				<Link href='/dashboard' className='text-blue-500 hover:underline'>
					Back to My Games
				</Link>
			</div>
		);
	}

	const initialData = {
		id: game.id,
		date: new Date(game.date),
		location: location,
	};

	return <GameForm initialData={initialData} isEditing={true} />;
}
