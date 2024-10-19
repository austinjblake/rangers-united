'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Store,
	Home,
	PencilIcon,
	TrashIcon,
	UserX,
	UserPlus,
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
import { supabase } from '@/supabaseClient';

export default function GameDetailsPage() {
	const [game, setGame] = useState<any>(null);
	const { gameId } = useParams();
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
	const [messages, setMessages] = useState<any[]>([]);
	const [notifications, setNotifications] = useState<any[]>([]);

	// fetch game details
	useEffect(() => {
		const fetchData = async () => {
			const gameResult = await getAllGameInfoAction(gameId as string);
			if (gameResult.status === 'success') setGame(gameResult.data);
		};

		fetchData();
	}, [gameId]);

	// setup supabase realtime listener for game notifications and messages
	useEffect(() => {
		const fetchData = async () => {
			// Fetch messages
			const { data: messagesData, error: messagesError } = await supabase
				.from('messages')
				.select(
					`
					id,
					message,
					created_at,
					sender_id,
					is_deleted,
					profiles (
						username
					)
				`
				)
				.eq('game_id', gameId)
				.eq('is_deleted', false)
				.order('created_at', { ascending: true });

			if (messagesError) {
				console.error('Error fetching messages:', messagesError);
			} else {
				setMessages(messagesData);
			}

			// Fetch notifications
			const { data: notificationsData, error: notificationsError } =
				await supabase
					.from('game_notifications')
					.select(
						`
					id,
					message,
					created_at
				`
					)
					.eq('game_id', gameId)
					.order('created_at', { ascending: false });

			if (notificationsError) {
				console.error('Error fetching notifications:', notificationsError);
			} else {
				setNotifications(notificationsData);
			}
		};

		fetchData();

		const channel = supabase.channel(`public:game_${gameId}`);

		// Handle real-time messages
		channel.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'messages',
				filter: `game_id=eq.${gameId}`,
			},
			async (payload) => {
				if (payload.new.is_deleted) return; // Ignore if the message is marked as deleted

				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('username')
					.eq('user_id', payload.new.sender_id)
					.single();

				if (profileError) {
					console.error('Error fetching sender username:', profileError);
				} else {
					const messageWithUsername = {
						...payload.new,
						profiles: { username: profileData.username },
					};
					setMessages((currentMessages) => [
						...currentMessages,
						messageWithUsername,
					]);
				}
			}
		);

		channel.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'messages',
				filter: `game_id=eq.${gameId}`,
			},
			async (payload) => {
				if (payload.new.is_deleted) {
					// Remove the message if it is marked as deleted
					setMessages((currentMessages) =>
						currentMessages.filter((message) => message.id !== payload.new.id)
					);
					return;
				}

				const { data: profileData, error: profileError } = await supabase
					.from('profiles')
					.select('username')
					.eq('user_id', payload.new.sender_id)
					.single();

				if (profileError) {
					console.error('Error fetching sender username:', profileError);
				} else {
					const updatedMessageWithUsername = {
						...payload.new,
						profiles: { username: profileData.username },
					};
					setMessages((currentMessages) =>
						currentMessages.map((message) =>
							message.id === payload.new.id
								? updatedMessageWithUsername
								: message
						)
					);
				}
			}
		);

		// Handle real-time notifications
		channel.on(
			'postgres_changes',
			{
				event: 'INSERT',
				schema: 'public',
				table: 'game_notifications',
				filter: `game_id=eq.${gameId}`,
			},
			(payload) => {
				setNotifications((currentNotifications) => [
					payload.new,
					...currentNotifications,
				]);
			}
		);

		channel.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [gameId]);

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

	if (!game) return <div>Loading...</div>;

	const LocationIcon = game.locationIsFLGS
		? Store
		: game.locationIsPrivate
		? Home
		: MapPin;

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
								<strong>Date:</strong> {formatDate(game.gameDate)}
							</p>
							<p className='flex items-center'>
								<Clock className='mr-2 h-5 w-5' />
								<strong>Time:</strong> {formatTime(game.gameDate)}
							</p>
						</div>
						<div>
							<p className='flex items-center'>
								<LocationIcon className='mr-2 h-5 w-5' />
								<strong>Location:</strong> {game.locationName}
							</p>
							<p className='flex items-center'>
								<Users className='mr-2 h-5 w-5' />
								<strong>Players:</strong> {game.joinerCount}
							</p>
						</div>
					</div>
					<p className='mt-2 flex items-center'>
						<MapPin className='mr-2 h-5 w-5' />
						<strong>Address:</strong>{' '}
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
						<strong>Status:</strong>{' '}
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
							<strong>Host:</strong> {game.hostUsername}
						</p>
					)}
					{/* Action Buttons */}
					<div className='mt-4 flex flex-wrap justify-between items-center gap-2'>
						<div className='flex flex-wrap gap-2'>
							{game.isHost ? (
								<>
									<Link href={`/games/edit/${gameId}`}>
										<Button variant='outline' size='sm' title='Edit Game'>
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
						<Button variant='outline' onClick={() => router.push('/dashboard')}>
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
