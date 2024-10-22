'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	PencilIcon,
	TrashIcon,
	UserX,
	UserPlus,
	AlertCircle,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/confirmationModal';
import { GameChat } from '@/components/game-chat';
import { GameNotifications } from '@/components/game-notifications';
import {
	getAllGameInfoAction,
	deleteGameAction,
	markGameAsFullAction,
} from '@/actions/games-actions';
import { deleteGameSlotAction } from '@/actions/slots-actions';
import { LocationIcon } from '@/components/location-icon';
import { cn } from '@/lib/utils';
import useChat from '@/lib/use-chat';
import { getUserIdAction } from '@/actions/profiles-actions';

export default function GameDetailsPage() {
	const [game, setGame] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const { gameId } = useParams();
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
	const [userId, setUserId] = useState<string>('');

	// fetch game details
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const gameResult = await getAllGameInfoAction(gameId as string);
			const userId = await getUserIdAction();
			if (gameResult.status === 'success') {
				setGame(gameResult.data);
				setUserId(userId || '');
			}
			setLoading(false);
		};

		fetchData();
	}, [gameId]);

	const { loadingMessages, messages, notifications } = useChat(
		game ? game.gameId : null,
		userId,
		game ? game.hostId : ''
	);

	const handleDeleteGame = async () => {
		const result = await deleteGameAction(gameId as string);
		if (result.status === 'success') {
			router.push('/dashboard');
		}
	};

	const handleLeaveGame = async () => {
		const result = await deleteGameSlotAction(game.slotId, gameId as string);
		if (result.status === 'success') {
			router.push('/dashboard');
		}
	};

	const handleToggleFull = async () => {
		const result = await markGameAsFullAction(gameId as string, !game.isFull);
		if (result.status === 'success') {
			setGame({ ...game, isFull: !game.isFull });
		}
	};

	if (loading) return <div>Loading...</div>;
	if (!game)
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

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl bg-background text-foreground'>
			<div className='bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden'>
				{/* Game Details */}
				<div className='p-6 bg-secondary text-secondary-foreground'>
					<h1 className='text-2xl font-bold mb-4'>Game Details</h1>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<p className='flex items-center'>
								<Calendar className='mr-2 h-5 w-5' />
								<strong>Date:&nbsp;</strong> {formatDate(game.gameDate)}
							</p>
							<p className='flex items-center'>
								<Clock className='mr-2 h-5 w-5' />
								<strong>Time:&nbsp;</strong> {formatTime(game.gameDate)}
							</p>
						</div>
						<div>
							<p className='flex items-center'>
								<LocationIcon
									isFLGS={game.locationIsFLGS}
									isPrivate={game.locationIsPrivate}
									className='mr-2 h-5 w-5'
								/>
								<strong>Location:&nbsp;</strong> {game.locationName}
							</p>
							<p className='flex items-center'>
								<Users className='mr-2 h-5 w-5' />
								<strong>Players:&nbsp;</strong> {game.joinerCount}
							</p>
						</div>
					</div>
					<p className='mt-2 flex items-center'>
						<MapPin className='mr-2 h-5 w-5' />
						<strong>Address:&nbsp;</strong>
						{game.isHost ? (
							game.readableAddress
						) : (
							<>
								{game.distance.toFixed(1)} miles away from{' '}
								{game.readableAddress}
							</>
						)}
					</p>
					<p className='mt-2 flex items-center space-x-2'>
						<strong>Status:&nbsp;</strong>
						<span
							className={`text-xs font-medium px-2 py-1 rounded-full ${
								game.isHost
									? 'bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200'
									: 'bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
							}`}
						>
							{game.isHost ? 'Hosting' : 'Joined'}
						</span>
						{game.isFull && (
							<span className='text-xs font-medium px-2 py-1 rounded-full bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200'>
								Full
							</span>
						)}
					</p>
					{!game.isHost && (
						<p className='mt-2'>
							<strong>Host:&nbsp;</strong> {game.hostUsername}
						</p>
					)}
					{/* Action Buttons */}
					<div className='mt-4 flex flex-wrap justify-between items-center gap-2'>
						<div className='flex flex-wrap gap-2'>
							{game.isHost ? (
								<>
									<Link href={`/games/edit/${gameId}`}>
										<Button
											variant='outline'
											size='sm'
											title='Edit Game'
											className='hover:bg-primary/20 hover:text-primary'
										>
											<PencilIcon className='h-4 w-4 mr-2' />
											Edit
										</Button>
									</Link>
									<Button
										variant='destructive'
										size='sm'
										onClick={() => setIsDeleteModalOpen(true)}
										title='Delete Game'
									>
										<TrashIcon className='h-4 w-4 mr-2' />
										Delete
									</Button>
									<Button
										variant='outline'
										size='sm'
										onClick={handleToggleFull}
										title={game.isFull ? 'Mark as Open' : 'Mark as Full'}
										className='hover:bg-primary/20 hover:text-primary'
									>
										{game.isFull ? (
											<UserPlus className='h-4 w-4 mr-2' />
										) : (
											<UserX className='h-4 w-4 mr-2' />
										)}
										{game.isFull ? 'Mark as Open' : 'Mark as Full'}
									</Button>
								</>
							) : (
								<Button
									variant='destructive'
									size='sm'
									onClick={() => setIsLeaveModalOpen(true)}
								>
									Leave Game
								</Button>
							)}
						</div>
						<Button
							variant='outline'
							onClick={() => router.push('/dashboard')}
							className='text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
						>
							Back to Dashboard
						</Button>
					</div>
				</div>
				<GameChat
					gameId={gameId as string}
					isHost={game.isHost}
					hostId={game.hostId}
					messages={messages}
				/>
				<Separator />
				<GameNotifications
					gameId={gameId as string}
					notifications={notifications}
				/>
			</div>

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteGame}
				title='Delete Game'
				message='Are you sure you want to delete this game? This action cannot be undone.'
			/>

			<ConfirmationModal
				isOpen={isLeaveModalOpen}
				onClose={() => setIsLeaveModalOpen(false)}
				onConfirm={handleLeaveGame}
				title='Leave Game'
				message='Are you sure you want to leave this game? You may not be able to rejoin if the game becomes full.'
			/>
		</div>
	);
}
