'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BasicGameDetails } from '@/components/gameDetails/basicGameDetails';
import FullGameDetails from '@/components/gameDetails/fullGameDetails';
import { getAllGameInfoAction } from '@/actions/games-actions';
import { getUserIdAction } from '@/actions/profiles-actions';

export default function GameDetailsPage() {
	const [game, setGame] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [notJoined, setNotJoined] = useState(false);
	const [refetch, setRefetch] = useState(false);
	const [userId, setUserId] = useState<string>('');
	const { gameId } = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const gameResult = await getAllGameInfoAction(gameId as string);
			let user = '';
			if (gameResult.status === 'success') {
				setNotJoined(gameResult.data.notJoined || false);
				setGame(gameResult.data);
				if (!gameResult.data.notJoined) {
					user = await getUserIdAction();
				}
				setUserId(user);
			}
			setLoading(false);
		};

		fetchData();
	}, [gameId, refetch]);

	if (loading) return <div>Loading...</div>;
	if (!game) return <GameNotFound />;

	return notJoined ? (
		<BasicGameDetails game={game} setRefetch={() => setRefetch(!refetch)} />
	) : (
		<FullGameDetails game={game} setGame={setGame} userId={userId} />
	);
}

function GameNotFound() {
	const router = useRouter();

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-background'>
			<div className='text-center p-8 rounded-lg bg-card shadow-lg'>
				<AlertCircle className='mx-auto h-12 w-12 text-destructive mb-4' />
				<h1 className='text-2xl font-bold text-foreground mb-2'>
					Game Not Found
				</h1>
				<p className='text-muted-foreground mb-4'>
					The game you&apos;re looking for doesn&apos;t exist or has been
					removed.
				</p>
				<Button
					variant='outline'
					onClick={() => router.push('/dashboard')}
					className='hover:bg-primary/10 hover:text-primary transition-colors'
				>
					Back to Dashboard
				</Button>
			</div>
		</div>
	);
}
