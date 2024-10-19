'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	MapPin,
	Calendar,
	User,
	Store,
	Home,
	UsersIcon,
	MapPinned,
	UserX,
	Check,
} from 'lucide-react';
import { getGamesByLocationAction } from '@/actions/games-actions';
import LocationSelector from '@/components/locationSelector/locationSelector';
import { SelectLocation } from '@/db/schema';
import { Slider } from '@/components/ui/slider';
import {
	checkUserSlotsRemaining,
	createGameSlotAction,
} from '@/actions/slots-actions';
import { createLocationAction } from '@/actions/locations-actions';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import MaxSlotsReachedCard from '@/components/max-slots-reached-card';
import { LocationIcon } from '@/components/location-icon';

interface SearchGameResult {
	distance: number;
	gameId: string;
	locationId: string;
	date: Date | null;
	createdAt: Date | null;
	isPrivate: boolean | null;
	isFLGS: boolean | null;
	locationName: string | null;
	hostUsername: string | null;
	joinerCount: number;
	hasJoined: boolean;
	isFull: boolean;
}

const GameCard = ({
	game,
	onJoin,
}: {
	game: SearchGameResult;
	onJoin: (gameId: string) => void;
}) => {
	const formatDate = (dateString: Date) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const formatTime = (dateString: Date) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<Card className='mb-3 bg-card text-card-foreground'>
			<CardHeader>
				<CardTitle className='text-lg flex items-center'>
					<LocationIcon
						isFLGS={game.isFLGS as boolean}
						isPrivate={game.isPrivate as boolean}
					/>
					{game.locationName}
					<span className='ml-2 flex items-center text-sm text-gray-500'>
						<MapPinned className='w-4 h-4 mr-1' />
						{game.distance.toFixed(1)} miles away
					</span>
				</CardTitle>
				<CardDescription>
					<span className='flex items-center'>
						<Calendar className='w-4 h-4 mr-2' />
						{formatDate(game.date as Date)} at {formatTime(game.date as Date)}
					</span>
				</CardDescription>
			</CardHeader>
			<CardContent>
				<span className='flex items-center mb-2'>
					<User className='w-4 h-4 mr-2' />
					Hosted by {game.hostUsername}
				</span>
				<span className='flex items-center'>
					<UsersIcon className='w-4 h-4 mr-2' />
					{game.joinerCount} player{game.joinerCount > 1 ? 's' : ''} in group
				</span>
			</CardContent>
			<CardFooter className='flex gap-2 items-center'>
				{game.hasJoined ? (
					<>
						<Button disabled className='bg-green-500 text-white'>
							<Check className='w-4 h-4 mr-2' />
							Joined
						</Button>
						<Button asChild>
							<Link href={`/games/${game.gameId}`}>View Game</Link>
						</Button>
					</>
				) : game.isFull ? (
					<>
						<Button disabled>Join Game</Button>
						<Button
							variant='destructive'
							disabled
							className='flex items-center'
						>
							<UserX className='w-4 h-4 mr-2' />
							Game is full
						</Button>
					</>
				) : (
					<Button onClick={() => onJoin(game.gameId)}>Join Game</Button>
				)}
			</CardFooter>
		</Card>
	);
};

const FilterSort = ({
	onFilterSort,
}: {
	onFilterSort: (type: string, value: string) => void;
}) => {
	return (
		<div className='flex flex-col sm:flex-row gap-4 mb-4 mt-6'>
			<Select onValueChange={(value) => onFilterSort('date', value)}>
				<SelectTrigger className='w-full sm:w-[200px]'>
					<Calendar className='w-4 h-4 mr-2' />
					<SelectValue placeholder='Sort by Date' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='default'>No sorting</SelectItem>
					<SelectItem value='asc'>Earliest First</SelectItem>
					<SelectItem value='desc'>Latest First</SelectItem>
				</SelectContent>
			</Select>
			<Select onValueChange={(value) => onFilterSort('locationType', value)}>
				<SelectTrigger className='w-full sm:w-[200px]'>
					<MapPin className='w-4 h-4 mr-2' />
					<SelectValue placeholder='Filter by Location' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>All Locations</SelectItem>
					<SelectItem value='flgs'>FLGS Only</SelectItem>
					<SelectItem value='private'>Private Only</SelectItem>
					<SelectItem value='other'>Other Locations</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default function GameSearchPage() {
	const router = useRouter();
	const [games, setGames] = useState<SearchGameResult[]>([]);
	const [filteredGames, setFilteredGames] = useState<SearchGameResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [searchRadius, setSearchRadius] = useState(10);
	const [searchLocation, setSearchLocation] = useState<SelectLocation>({
		id: '',
		userId: '',
		name: '',
		location: '',
		readableAddress: '',
		isFLGS: null,
		isPrivate: null,
		temporary: null,
	});
	const [filters, setFilters] = useState({
		date: 'default',
		locationType: 'all',
	});
	const [hasSlotsRemaining, setHasSlotsRemaining] = useState(true);

	useEffect(() => {
		checkSlotsRemaining();
	}, []);

	const checkSlotsRemaining = async () => {
		const result = await checkUserSlotsRemaining();
		setHasSlotsRemaining(result.data);
	};

	const searchGames = async (location: SelectLocation, radius: number) => {
		setLoading(true);
		setError(null);
		// location for search results. in case location selector is changed but search not triggered
		setSearchLocation(location);
		try {
			const result = await getGamesByLocationAction(location.location, radius);
			if (result.status === 'success' && result.data) {
				setGames(result.data as SearchGameResult[]);
				setFilteredGames(result.data as SearchGameResult[]);
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError('An error occurred while fetching games');
		} finally {
			setLoading(false);
		}
	};

	const joinGame = async (gameId: string) => {
		let locationId = searchLocation.id;
		if (!searchLocation.id) {
			const newLocation = await createLocationAction({
				id: '',
				userId: '',
				location: searchLocation.readableAddress,
				readableAddress: searchLocation.readableAddress,
				name: searchLocation.name,
				isPrivate: searchLocation.isPrivate,
				isFLGS: searchLocation.isFLGS,
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
				description:
					'You have successfully joined the game. You will be redirected to the game page.',
			});

			// Delay the redirection to allow the user to see the toast
			setTimeout(() => {
				router.push(`/games/${gameId}`);
			}, 1000);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to join the game.',
				variant: 'destructive',
			});
		}
	};

	const handleFilterSort = (type: string, value: string) => {
		const newFilters = { ...filters, [type]: value };
		setFilters(newFilters);

		let result = [...games];

		if (newFilters.date !== 'default') {
			result.sort((a, b) => {
				if (!a.date || !b.date) return 0;
				return newFilters.date === 'asc'
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime();
			});
		}

		if (newFilters.locationType !== 'all') {
			result = result.filter((game) => {
				if (newFilters.locationType === 'flgs') return game.isFLGS === true;
				if (newFilters.locationType === 'private')
					return game.isPrivate === true;
				if (newFilters.locationType === 'other')
					return !game.isFLGS && !game.isPrivate;
				return true;
			});
		}

		setFilteredGames(result);
	};

	if (!hasSlotsRemaining) {
		return <MaxSlotsReachedCard />;
	}

	return (
		<div className='container mx-auto px-4 py-8 bg-background text-foreground'>
			<h1 className='text-3xl font-bold mb-6'>Find and Join Games</h1>
			<LocationSelector
				type='searchGame'
				onUseLocation={(location) => searchGames(location, searchRadius)}
			>
				<div className='space-y-2 mt-4 mb-4 w-full'>
					<label htmlFor='radius' className='block text-sm font-medium'>
						Search Radius: {searchRadius} miles
					</label>
					<Slider
						id='radius'
						min={1}
						max={150}
						step={1}
						value={[searchRadius]}
						onValueChange={(value) => setSearchRadius(value[0])}
						className='w-full'
					/>
				</div>
			</LocationSelector>
			<FilterSort onFilterSort={handleFilterSort} />
			{loading && <p>Loading games...</p>}
			{error && <p className='text-red-500'>{error}</p>}
			{!loading && !error && games.length === 0 && (
				<Card>
					<CardContent>
						<p className='text-center py-4'>
							No games found in this area. Try adjusting your search criteria or
							check back later!
						</p>
					</CardContent>
				</Card>
			)}
			{filteredGames.map((game) => (
				<GameCard key={game.gameId} game={game} onJoin={joinGame} />
			))}
			<div className='mt-8 text-sm text-gray-600'>
				<p>
					Privacy Note: Game hosts have control over sharing specific location
					details.
				</p>
			</div>
		</div>
	);
}
