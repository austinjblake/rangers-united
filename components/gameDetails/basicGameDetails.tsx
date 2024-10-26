'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Calendar,
	Clock,
	HomeIcon,
	Info,
	MapPinIcon,
	StoreIcon,
	Users,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { LocationIcon } from '@/components/location-icon';
import LocationSelector from '@/components/locationSelector/locationSelector';
import { toast } from '@/components/ui/use-toast';
import { createGameSlotAction } from '@/actions/slots-actions';
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from '@radix-ui/react-tooltip';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { createLocationAction } from '@/actions/locations-actions';

interface BasicGameDetailsProps {
	game: {
		gameDate: string;
		locationName: string;
		locationIsPrivate: boolean;
		locationIsFLGS: boolean;
		hostUsername: string;
		joinerCount: string;
	};
	setRefetch: () => void;
}

export function BasicGameDetails({ game, setRefetch }: BasicGameDetailsProps) {
	const [showLocationSelector, setShowLocationSelector] = useState(false);
	const router = useRouter();
	const [selectedLocation, setSelectedLocation] = useState<any>(null);
	const { gameId } = useParams();

	const handleLocationSelect = (location: any) => {
		if (Array.isArray(location)) {
			setSelectedLocation(location[0]);
		} else {
			setSelectedLocation(location);
		}
	};
	const handleResetLocation = () => {
		setSelectedLocation(null);
	};

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

	const joinGame = async (gameId: string) => {
		let locationId = selectedLocation.id;
		if (!selectedLocation.id) {
			const newLocation = await createLocationAction({
				id: '',
				userId: '',
				location: selectedLocation.readableAddress,
				readableAddress: selectedLocation.readableAddress,
				name: selectedLocation.name,
				isPrivate: selectedLocation.isPrivate,
				isFLGS: selectedLocation.isFLGS,
				temporary: true,
			});
			locationId = newLocation.data.id;
		}
		const joinResult = await createGameSlotAction({
			gameId,
			joinerLocationId: locationId,
		});

		if (joinResult.status === 'success') {
			toast({
				title: 'Game Joined!',
				description: 'You have successfully joined the game.',
			});

			// Delay refetch to allow the user to see the toast
			setTimeout(() => {
				setRefetch();
			}, 500);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to join the game.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 max-w-4xl bg-background text-foreground'>
			<div className='bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden'>
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
					<p className='mt-2'>
						<strong>Host:&nbsp;</strong> {game.hostUsername}
					</p>

					<p className='mt-2 flex items-center space-x-2'>
						<strong>Status:&nbsp;</strong>
						<span className='text-xs font-medium px-2 py-1 rounded-full bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200'>
							Not Joined
						</span>
					</p>
					<div className='mt-4 flex justify-end gap-4'>
						{!showLocationSelector && (
							<Button onClick={() => setShowLocationSelector(true)}>
								Join Game
							</Button>
						)}
						<Button
							variant='outline'
							onClick={() => router.push('/dashboard')}
							className='text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
						>
							Back to Dashboard
						</Button>
					</div>

					{showLocationSelector && (
						<>
							{selectedLocation ? (
								<>
									<Card>
										<CardHeader>
											<CardTitle>Selected Location</CardTitle>
										</CardHeader>
										<CardContent>
											<div className='flex items-center space-x-2'>
												{selectedLocation.isFLGS && (
													<span title='Friendly Local Game Store'>
														<StoreIcon className='h-5 w-5' />
													</span>
												)}
												{selectedLocation.isPrivate && (
													<span title='Private Location'>
														<HomeIcon className='h-5 w-5' />
													</span>
												)}
												{!selectedLocation.isFLGS &&
													!selectedLocation.isPrivate && (
														<span title='Other Location'>
															<MapPinIcon className='h-5 w-5' />
														</span>
													)}
												<p>{selectedLocation.name || 'Other Location'}</p>
												<div className='text-sm text-gray-500'>
													{selectedLocation.readableAddress}
												</div>
											</div>
											<Button
												onClick={handleResetLocation}
												className='mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900'
											>
												Change Location
											</Button>
											<div className='flex items-center space-x-2 mt-4'>
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger className='flex items-center space-x-2'>
															<Info className='h-4 w-4 text-muted-foreground' />
															<p className='text-sm text-muted-foreground'>
																Your exact location will not be revealed to
																other users.
															</p>
														</TooltipTrigger>
														<TooltipContent className='max-w-xs'>
															<p>
																Your exact location (such as your home address)
																will not be revealed to other users. The host
																will have full control over when and how to
																share specific details before the game starts.
															</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</CardContent>
									</Card>
									<Button
										className='w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 mt-4'
										onClick={() => joinGame(gameId as string)}
										disabled={!selectedLocation}
									>
										Join Game
									</Button>
								</>
							) : (
								<LocationSelector
									type='joinGame'
									onUseLocation={handleLocationSelect}
								/>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
