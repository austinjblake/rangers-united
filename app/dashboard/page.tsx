'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	CalendarIcon,
	MapPinIcon,
	UsersIcon,
	PencilIcon,
	TrashIcon,
	ChevronRightIcon,
	Store,
	Home,
	MapPinned,
	ClockIcon,
} from 'lucide-react';
import { ConfirmationModal } from '@/components/confirmationModal';
import {
	getGameSlotsByUserIdAction,
	deleteGameSlotAction,
} from '@/actions/slots-actions';

interface GameSlot {
	slotId: string;
	isHost: boolean;
	joinerLocationId: string;
	gameLocationId: string;
	gameDate: string;
	gameId: string;
	locationIsPrivate: boolean;
	locationIsFLGS: boolean;
	joinerCount: string;
	distance: number;
	readableAddress: string;
	locationName: string;
}

export default function Dashboard() {
	const [gameSlots, setGameSlots] = useState<GameSlot[]>([]);
	const [modalState, setModalState] = useState({
		isOpen: false,
		title: '',
		message: '',
		onConfirm: () => {},
	});

	useEffect(() => {
		fetchGameSlots();
	}, []);

	const fetchGameSlots = async () => {
		const result = await getGameSlotsByUserIdAction();
		if (result.status === 'success' && result.data) {
			console.log('game slots for user', result.data);
			setGameSlots(result.data);
		}
	};

	const openModal = (title: string, message: string, onConfirm: () => void) => {
		setModalState({ isOpen: true, title, message, onConfirm });
	};

	const closeModal = () => {
		setModalState({ ...modalState, isOpen: false });
	};

	const handleDeleteGame = (gameId: string) => {
		openModal(
			'Delete Game',
			'Are you sure you want to delete this game? This action cannot be undone.',
			async () => {
				const result = await deleteGameSlotAction(gameId);
				if (result.status === 'success') {
					fetchGameSlots();
				}
				closeModal();
			}
		);
	};

	const handleLeaveGame = (gameId: string) => {
		openModal(
			'Leave Game',
			'Are you sure you want to leave this game? You may not be able to rejoin if the game becomes full.',
			() => {
				console.log(`Leaving game ${gameId}`);
				closeModal();
			}
		);
	};

	return (
		<div className='min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8'>
			<h1 className='mb-6 text-2xl font-bold text-gray-900 sm:text-3xl'>
				Your Game Dashboard
			</h1>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{gameSlots.map((slot) => (
					<Card
						key={slot.slotId}
						className='overflow-hidden transition-shadow hover:shadow-lg'
					>
						<GameSlot
							game={slot}
							onDelete={() => handleDeleteGame(slot.slotId)}
							onLeave={() => handleLeaveGame(slot.slotId)}
						/>
					</Card>
				))}
				{Array.from({ length: Math.max(0, 5 - gameSlots.length) }).map(
					(_, index) => (
						<Card
							key={`empty-${index}`}
							className='overflow-hidden transition-shadow hover:shadow-lg'
						>
							<EmptySlot />
						</Card>
					)
				)}
			</div>
			<ConfirmationModal
				isOpen={modalState.isOpen}
				onClose={closeModal}
				onConfirm={modalState.onConfirm}
				title={modalState.title}
				message={modalState.message}
			/>
		</div>
	);
}

function EmptySlot() {
	return (
		<CardContent className='flex flex-col items-center justify-center space-y-4 p-6'>
			<p className='text-center text-sm text-gray-500'>No game scheduled</p>
			<Button className='w-full' variant='outline'>
				Host a Game
			</Button>
			<Button className='w-full'>Search for a Game</Button>
		</CardContent>
	);
}

function GameSlot({
	game,
	onDelete,
	onLeave,
}: {
	game: GameSlot;
	onDelete: () => void;
	onLeave: () => void;
}) {
	const [showFullAddress, setShowFullAddress] = useState(false);

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

	const LocationIcon = () => {
		if (game.locationIsFLGS) {
			return (
				<span title='Friendly Local Game Store'>
					<Store className='w-4 h-4 mr-2' />
				</span>
			);
		} else if (game.locationIsPrivate) {
			return (
				<span title='Private Location'>
					<Home className='w-4 h-4 mr-2' />
				</span>
			);
		} else {
			return (
				<span title='Other Location'>
					<MapPinIcon className='w-4 h-4 mr-2' />
				</span>
			);
		}
	};

	const truncateAddress = (address: string, maxLength: number) => {
		if (address?.length <= maxLength) return address;
		return `${address?.substring(0, maxLength)}...`;
	};

	return (
		<div className='flex h-full flex-col'>
			<CardHeader className='pb-2'>
				<CardTitle className='flex items-center justify-between text-lg'>
					<span className='flex items-center'>
						<LocationIcon />
						{game.locationName}
					</span>
					<span
						className={`text-sm font-medium px-2 py-1 rounded-full ${
							game.isHost
								? 'bg-green-100 text-green-800'
								: 'bg-blue-100 text-blue-800'
						}`}
					>
						{game.isHost ? 'Hosting' : 'Joined'}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex-grow pt-2'>
				<div className='space-y-3 text-sm'>
					<p className='flex items-center text-gray-700'>
						<CalendarIcon className='mr-2 h-5 w-5 text-gray-500' />
						<span className='font-medium'>{formatDate(game.gameDate)}</span>
					</p>
					<p className='flex items-center text-gray-700'>
						<ClockIcon className='mr-2 h-5 w-5 text-gray-500' />
						<span>{formatTime(game.gameDate)}</span>
					</p>
					<p className='flex items-center text-gray-700'>
						<UsersIcon className='mr-2 h-5 w-5 text-gray-500' />
						<span>
							{game.joinerCount} player
							{parseInt(game.joinerCount) !== 1 ? 's' : ''} in group
						</span>
					</p>
					<p
						className='flex items-center text-gray-700 cursor-pointer'
						onClick={() => setShowFullAddress(!showFullAddress)}
					>
						<MapPinned className='mr-2 h-5 w-5 text-gray-500 flex-shrink-0 ' />
						<span>
							{game.isHost ? (
								showFullAddress ? (
									game.readableAddress
								) : (
									truncateAddress(game.readableAddress, 30)
								)
							) : (
								<>
									{game.distance.toFixed(1)} miles away from{' '}
									{showFullAddress
										? game.readableAddress
										: truncateAddress(game.readableAddress, 9)}
								</>
							)}
						</span>
					</p>
				</div>
			</CardContent>
			<CardFooter className='mt-auto pt-4 border-t'>
				<div className='flex items-center justify-between w-full'>
					<div className='flex space-x-2'>
						{game.isHost ? (
							<>
								<Button variant='outline' size='sm' title='Edit Game'>
									<PencilIcon className='h-4 w-4 mr-1' />
								</Button>
								<Button
									variant='outline'
									size='sm'
									onClick={(e) => {
										e.preventDefault();
										onDelete();
									}}
									title='Delete Game'
								>
									<TrashIcon className='h-4 w-4 mr-1' />
								</Button>
							</>
						) : (
							<Button
								variant='outline'
								size='sm'
								onClick={(e) => {
									e.preventDefault();
									onLeave();
								}}
							>
								Leave
							</Button>
						)}
					</div>
					<Link href={`/games/${game.gameId}`}>
						<Button
							variant='outline'
							size='sm'
							className='flex items-center group'
						>
							View Game
							<ChevronRightIcon className='h-5 w-5 text-gray-400 ml-2 transition-transform duration-200 group-hover:translate-x-1' />
						</Button>
					</Link>
				</div>
			</CardFooter>
		</div>
	);
}
