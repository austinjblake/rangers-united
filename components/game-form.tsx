'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
	CalendarIcon,
	Info,
	HomeIcon,
	StoreIcon,
	MapPinIcon,
} from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { createGameAction, updateGameAction } from '@/actions/games-actions';
import {
	createGameSlotAction,
	updateGameSlotAction,
} from '@/actions/slots-actions';
import LocationSelector from '@/components/locationSelector/locationSelector';
import { SelectLocation } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

interface GameFormProps {
	initialData?: {
		id: string;
		date: Date;
		location: SelectLocation;
	};
	isEditing?: boolean;
}

export default function GameForm({
	initialData,
	isEditing = false,
}: GameFormProps) {
	const router = useRouter();
	const [gameDate, setGameDate] = useState<Date | undefined>(
		initialData?.date || undefined
	);
	const [gameTime, setGameTime] = useState<string>(
		initialData?.date ? format(initialData.date, 'HH:mm') : ''
	);
	const [selectedLocation, setSelectedLocation] =
		useState<SelectLocation | null>(initialData?.location || null);

	const handleLocationSelect = (
		location: SelectLocation | SelectLocation[]
	) => {
		if (Array.isArray(location)) {
			setSelectedLocation(location[0]);
		} else {
			setSelectedLocation(location);
		}
	};

	const handleResetLocation = () => {
		setSelectedLocation(null);
	};

	const handleSubmit = async () => {
		if (!gameDate || !gameTime || !selectedLocation) {
			toast({
				title: 'Error',
				description: 'Please fill in all fields.',
				variant: 'destructive',
			});
			return;
		}

		const gameData = {
			location: selectedLocation.location,
			date: new Date(`${format(gameDate, 'yyyy-MM-dd')}T${gameTime}`),
			flgs: selectedLocation.isFLGS,
			private: selectedLocation.isPrivate,
		};

		let result;
		if (isEditing && initialData) {
			console.log('selected location', selectedLocation);
			result = await updateGameAction(initialData.id, {
				location: selectedLocation,
				date: gameData.date,
			});

			if (result.status === 'success') {
				toast({
					title: 'Game Updated!',
					description: 'Your game has been successfully updated.',
				});

				setTimeout(() => {
					router.push(`/games/${initialData.id}`);
				}, 1000);
			} else {
				toast({
					title: 'Error',
					description: 'Failed to update game.',
					variant: 'destructive',
				});
			}
		} else {
			result = await createGameAction(gameData, selectedLocation);

			if (result.status === 'success' && result.data) {
				const slotData = {
					isHost: true,
					slotTime: gameData.date,
					location: gameData.location,
					gameId: result.data.id,
					locationId: result.data.locationId,
				};

				const slotResult = await createGameSlotAction(slotData);

				if (slotResult.status === 'success') {
					toast({
						title: 'Game Created!',
						description:
							'Your game has been successfully created. You will be redirected to your new game page.',
					});
					setTimeout(() => {
						router.push(`/games/${slotData.gameId}`);
					}, 1000);
				} else {
					toast({
						title: 'Error',
						description: 'Failed to create game slot.',
						variant: 'destructive',
					});
				}
			} else {
				toast({
					title: 'Error',
					description: 'Failed to create game.',
					variant: 'destructive',
				});
			}
		}
	};

	return (
		<div className='container mx-auto p-6 max-w-2xl'>
			<h1 className='text-3xl font-bold mb-6'>
				{isEditing ? 'Edit Game' : 'Create a New Game'}
			</h1>
			<div className='space-y-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='flex flex-col'>
						<label className='mb-2'>Game Date</label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={'outline'}
									className={cn(
										'w-full pl-3 text-left font-normal',
										!gameDate && 'text-muted-foreground'
									)}
								>
									{gameDate ? (
										format(gameDate, 'PPP')
									) : (
										<span>Pick a date</span>
									)}
									<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-auto p-0' align='start'>
								<Calendar
									mode='single'
									selected={gameDate}
									onSelect={setGameDate}
									disabled={(date) =>
										date < new Date() || date < new Date('1900-01-01')
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
					<div className='flex flex-col'>
						<label className='mb-2'>Game Time</label>
						<div className='relative'>
							<Input
								type='time'
								value={gameTime}
								onChange={(e) => setGameTime(e.target.value)}
								className='w-full'
							/>
						</div>
					</div>
				</div>

				{selectedLocation ? (
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
								{!selectedLocation.isFLGS && !selectedLocation.isPrivate && (
									<span title='Other Location'>
										<MapPinIcon className='h-5 w-5' />
									</span>
								)}
								<p>{selectedLocation.name || 'Other Location'}</p>
								<div className='text-sm text-gray-500'>
									{selectedLocation.readableAddress}
								</div>
							</div>
							<Button onClick={handleResetLocation} className='mt-4'>
								Change Location
							</Button>
							<div className='flex items-center space-x-2 mt-4'>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger className='flex items-center space-x-2'>
											<Info className='h-4 w-4 text-muted-foreground' />
											<p className='text-sm text-muted-foreground'>
												Your exact location will not be revealed to other users.
											</p>
										</TooltipTrigger>
										<TooltipContent className='max-w-xs'>
											<p>
												Your exact location (such as your home address) will not
												be revealed to other users. The host will have full
												control over when and how to share specific details
												before the game starts.
											</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</CardContent>
					</Card>
				) : (
					<LocationSelector
						type='hostGame'
						onUseLocation={handleLocationSelect}
					/>
				)}

				<Button
					disabled={!gameDate || !gameTime || !selectedLocation}
					onClick={handleSubmit}
					className='w-full'
				>
					{isEditing ? 'Update Game' : 'Create Game'}
				</Button>
			</div>
		</div>
	);
}
