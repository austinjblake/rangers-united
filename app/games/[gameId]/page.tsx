'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
	Calendar,
	Clock,
	MapPin,
	Users,
	Store,
	Home,
	Send,
	PencilIcon,
	TrashIcon,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConfirmationModal } from '@/components/confirmationModal';

// Importing actions (these would be your actual API calls)
import { getAllGameInfo, deleteGameAction } from '@/actions/games-actions';
import {
	getMessagesByGameIdAction,
	createMessageAction,
	deleteMessageAction,
} from '@/actions/messages-actions';
import { getNotificationByGameIdAction } from '@/actions/notifications-actions';
import { deleteGameSlotAction } from '@/actions/slots-actions';

export default function GameDetailsPage() {
	const [game, setGame] = useState<any>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [notifications, setNotifications] = useState<any[]>([]);
	const [newMessage, setNewMessage] = useState('');
	const { gameId } = useParams();
	const router = useRouter();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const gameResult = await getAllGameInfo(gameId as string);
			const messagesResult = await getMessagesByGameIdAction(gameId as string);
			const notificationsResult = await getNotificationByGameIdAction(
				gameId as string
			);

			if (gameResult.status === 'success') setGame(gameResult.data);
			if (messagesResult.status === 'success') setMessages(messagesResult.data);
			if (notificationsResult.status === 'success')
				setNotifications(notificationsResult.data);
		};

		fetchData();
	}, [gameId]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			const result = await createMessageAction({
				gameId: gameId as string,
				message: newMessage,
			});
			if (result.status === 'success') {
				setMessages([...messages, result.data]);
				setNewMessage('');
			}
		}
	};

	const handleDeleteMessage = async (id: string) => {
		const result = await deleteMessageAction(id, gameId as string);
		if (result.status === 'success') {
			setMessages(messages.filter((message) => message.id !== id));
		}
	};

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
		<div className='container mx-auto px-4 py-8 max-w-4xl'>
			<div className='bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden'>
				{/* Game Details */}
				<div className='p-6 bg-primary text-primary-foreground'>
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
					<p className='mt-2'>
						<strong>Status:</strong>{' '}
						<span
							className={`px-2 py-1 rounded-full ${
								game.isHost
									? 'bg-green-100 text-green-800'
									: 'bg-blue-100 text-blue-800'
							}`}
						>
							{game.isHost ? 'Hosting' : 'Joined'}
						</span>
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
										<Button variant='secondary' size='sm' title='Edit Game'>
											<PencilIcon className='h-4 w-4 mr-1' />
											Edit
										</Button>
									</Link>
									<Button
										variant='destructive'
										size='sm'
										onClick={() => setIsDeleteModalOpen(true)}
										title='Delete Game'
									>
										<TrashIcon className='h-4 w-4 mr-1' />
										Delete
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
							variant='secondary'
							onClick={() => router.push('/dashboard')}
						>
							Back to Dashboard
						</Button>
					</div>
				</div>

				{/* Chat Window */}
				<div className='p-6'>
					<h2 className='text-xl font-semibold mb-4'>Chat</h2>
					<ScrollArea className='h-[300px] w-full rounded-md border p-4'>
						{messages.map((message) => (
							<div key={message.id} className='mb-4 relative group'>
								<p className='font-semibold'>{message.userId}</p>
								<p>{message.content}</p>
								<small className='text-muted-foreground'>
									{new Date(message.createdAt).toLocaleString()}
								</small>
								{(game.isHost || message.userId === 'currentUserId') && (
									<button
										onClick={() => handleDeleteMessage(message.id)}
										className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<TrashIcon className='h-4 w-4 text-destructive' />
									</button>
								)}
							</div>
						))}
					</ScrollArea>
					<div className='mt-4 flex'>
						<Input
							type='text'
							placeholder='Type a message...'
							value={newMessage}
							onChange={(e) => setNewMessage(e.target.value)}
							className='flex-grow'
						/>
						<Button onClick={handleSendMessage} className='ml-2'>
							<Send className='h-4 w-4' />
						</Button>
					</div>
				</div>

				<Separator />

				{/* Notifications */}
				<div className='p-6'>
					<h2 className='text-xl font-semibold mb-4'>Notifications</h2>
					<ScrollArea className='h-[200px] w-full rounded-md border p-4'>
						{notifications.map((notification) => (
							<div
								key={notification.id}
								className='mb-4 bg-muted p-3 rounded-md'
							>
								<p>{notification.content}</p>
								<small className='text-muted-foreground'>
									{new Date(notification.createdAt).toLocaleString()}
								</small>
							</div>
						))}
					</ScrollArea>
				</div>
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
