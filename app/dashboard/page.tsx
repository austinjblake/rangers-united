'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	CalendarIcon,
	UsersIcon,
	PencilIcon,
	TrashIcon,
	ChevronRightIcon,
	MapPinned,
	ClockIcon,
	UserX,
	UserPlus,
} from 'lucide-react';
import { ConfirmationModal } from '@/components/confirmationModal';
import {
	getGameSlotsByUserIdAction,
	deleteGameSlotAction,
} from '@/actions/slots-actions';
import { markGameAsFullAction } from '@/actions/games-actions';
import { deleteGameAction } from '@/actions/games-actions';
import { LocationIcon } from '@/components/location-icon';

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
	isFull: boolean;
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
				const result = await deleteGameAction(gameId);
				if (result.status === 'success') {
					fetchGameSlots();
				}
				closeModal();
			}
		);
	};

	const handleLeaveGame = (gameSlotId: string, gameId: string) => {
		openModal(
			'Leave Game',
			'Are you sure you want to leave this game? You may not be able to rejoin if the game becomes full.',
			async () => {
				const result = await deleteGameSlotAction(gameSlotId, gameId);
				if (result.status === 'success') {
					fetchGameSlots();
				}
				closeModal();
			}
		);
	};

	return (
		<div className='min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8'>
			<h1 className='mb-6 text-2xl font-bold sm:text-3xl'>
				Your Game Dashboard
			</h1>
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{gameSlots.map((slot) => (
					<Card
						key={slot.slotId}
						className='overflow-hidden transition-shadow hover:shadow-lg bg-card text-card-foreground'
					>
						<GameSlot
							game={slot}
							onDelete={() => handleDeleteGame(slot.gameId)}
							onLeave={() => handleLeaveGame(slot.slotId, slot.gameId)}
							refetchGameSlots={fetchGameSlots}
						/>
					</Card>
				))}
				{Array.from({ length: Math.max(0, 5 - gameSlots.length) }).map(
					(_, index) => (
						<Card
							key={`empty-${index}`}
							className='overflow-hidden transition-shadow hover:shadow-lg bg-card text-card-foreground'
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
			<p className='text-center text-sm text-muted-foreground'>
				No game scheduled
			</p>
			<Link href='/host-game' className='w-full'>
				<Button
					className='w-full text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
					variant='outline'
				>
					Host a Game
				</Button>
			</Link>
			<Link href='/join-game' className='w-full'>
				<Button className='w-full bg-secondary text-secondary-foreground hover:bg-secondary-foreground/30 hover:text-primary transition-colors dark:hover:bg-secondary-foreground/20'>
					Search for a Game
				</Button>
			</Link>
		</CardContent>
	);
}

function GameSlot({
	game,
	onDelete,
	onLeave,
	refetchGameSlots,
}: {
	game: GameSlot;
	onDelete: () => void;
	onLeave: () => void;
	refetchGameSlots: () => Promise<void>;
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

	const truncateAddress = (address: string, maxLength: number) => {
		if (address?.length <= maxLength) return address;
		return `${address?.substring(0, maxLength)}...`;
	};

	const handleToggleFull = async () => {
		const result = await markGameAsFullAction(game.gameId, !game.isFull);
		if (result.status === 'success') {
			// Refresh the game slots
			refetchGameSlots();
		}
	};

	return (
		<div className='flex h-full flex-col p-4'>
			<div className='flex flex-col mb-3'>
				<div className='flex items-center justify-between mb-2'>
					<div className='flex items-center flex-wrap'>
						<LocationIcon
							isFLGS={game.locationIsFLGS}
							isPrivate={game.locationIsPrivate}
							className='mr-2 h-5 w-5 flex-shrink-0'
						/>
						<span className='font-semibold text-lg break-words'>
							{game.locationName}
						</span>
					</div>
				</div>
				<div className='flex flex-wrap gap-1'>
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
				</div>
			</div>

			<div className='space-y-2 text-sm flex-grow'>
				<p className='flex items-center'>
					<CalendarIcon className='mr-2 h-4 w-4 text-muted-foreground' />
					<span>{formatDate(game.gameDate)}</span>
				</p>
				<p className='flex items-center'>
					<ClockIcon className='mr-2 h-4 w-4 text-muted-foreground' />
					<span>{formatTime(game.gameDate)}</span>
				</p>
				<p className='flex items-center'>
					<UsersIcon className='mr-2 h-4 w-4 text-muted-foreground' />
					<span>
						{game.joinerCount} player
						{parseInt(game.joinerCount) !== 1 ? 's' : ''} in group
					</span>
				</p>
				<div
					className='flex items-start cursor-pointer'
					onClick={() => setShowFullAddress(!showFullAddress)}
				>
					<MapPinned className='mr-2 h-4 w-4 text-muted-foreground flex-shrink-0 mt-1' />
					<span className='flex-grow'>
						{game.isHost ? (
							<span className={showFullAddress ? '' : 'truncate'}>
								{showFullAddress
									? game.readableAddress
									: truncateAddress(game.readableAddress, 30)}
							</span>
						) : (
							<span className={showFullAddress ? '' : 'truncate'}>
								{game.distance.toFixed(1)} miles away from{' '}
								{showFullAddress
									? game.readableAddress
									: truncateAddress(game.readableAddress, 10)}
							</span>
						)}
					</span>
				</div>
			</div>

			<div className='mt-4 pt-4 border-t border-border flex flex-wrap gap-2 justify-between items-center'>
				<div className='flex flex-wrap gap-2'>
					{game.isHost ? (
						<>
							<Link href={`/games/edit/${game.gameId}`}>
								<Button
									variant='outline'
									size='sm'
									title='Edit Game'
									className='text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
								>
									<PencilIcon className='h-4 w-4' />
								</Button>
							</Link>
							<Button
								variant='outline'
								size='sm'
								onClick={onDelete}
								title='Delete Game'
								className='text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors'
							>
								<TrashIcon className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='sm'
								onClick={handleToggleFull}
								title={game.isFull ? 'Mark as Open' : 'Mark as Full'}
								className='text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
							>
								{game.isFull ? (
									<UserPlus className='h-4 w-4' />
								) : (
									<UserX className='h-4 w-4' />
								)}
							</Button>
						</>
					) : (
						<Button
							variant='outline'
							size='sm'
							onClick={onLeave}
							className='text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors'
						>
							Leave
						</Button>
					)}
				</div>
				<Link
					href={`/games/${game.gameId}`}
					className='flex-grow sm:flex-grow-0'
				>
					<Button
						variant='outline'
						size='sm'
						className='w-full text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
					>
						View Game
						<ChevronRightIcon className='h-5 w-5 ml-2' />
					</Button>
				</Link>
			</div>
		</div>
	);
}
