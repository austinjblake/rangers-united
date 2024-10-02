import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectLocation } from '@/db/schema';
import { AddressInput } from './addressInput';
import { Loader2, StoreIcon, Star, HelpCircle, Globe } from 'lucide-react';
import { getNearbyFLGS } from '@/actions/locations-actions';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';

type FlgsSearchProps = {
	onSelect: (location: SelectLocation) => void;
	selectedLocation: SelectLocation | null;
	onSave: (location: SelectLocation) => void;
};

type FLGSResult = {
	name: string;
	formatted_address: string;
	rating: number;
	place_id: string;
	business_status: string;
};

export function FlgsSearch({
	onSelect,
	selectedLocation,
	onSave,
}: FlgsSearchProps) {
	const [address, setAddress] = useState('');
	const [searchResults, setSearchResults] = useState<FLGSResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [radius, setRadius] = useState(10);

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		if (!address) {
			console.error('No address provided');
			setIsLoading(false);
			return;
		}

		try {
			const response = await getNearbyFLGS(address, radius);
			if (response.status === 'success' && response.data.results) {
				const operationalLocations = response.data.results.filter(
					(location: FLGSResult) => location.business_status === 'OPERATIONAL'
				);
				setSearchResults(operationalLocations);
			} else {
				console.error('Error fetching nearby FLGS:', response.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelect = (location: FLGSResult) => {
		onSelect({
			id: location.place_id,
			name: location.name,
			location: location.formatted_address,
			isPrivate: false,
			userId: null,
			isFLGS: true,
			readableAddress: location.formatted_address,
		});
	};

	const handleSave = () => {
		if (selectedLocation) {
			onSave({
				id: selectedLocation.id,
				name: selectedLocation.name,
				location: selectedLocation.location,
				isPrivate: false,
				userId: null,
				isFLGS: true,
				readableAddress: selectedLocation.readableAddress,
			});
		}
	};

	const handleGoogleSearch = (location: FLGSResult) => {
		const searchQuery = encodeURIComponent(
			`${location.name} ${location.formatted_address}`
		);
		window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
	};

	return (
		<div className='space-y-4'>
			<form onSubmit={handleSearch} className='space-y-4'>
				<div className='space-y-2'>
					<label htmlFor='address' className='block text-sm font-medium'>
						Zip Code
					</label>
					<AddressInput onAddressChange={setAddress} />
				</div>
				<div className='space-y-2'>
					<label htmlFor='radius' className='block text-sm font-medium'>
						Search Radius (miles)
					</label>
					<div className='flex items-center space-x-2'>
						<Input
							id='radius'
							type='number'
							value={radius}
							onChange={(e) => setRadius(parseInt(e.target.value))}
							placeholder='Enter radius'
							className='w-full'
							min='1'
							max='50'
						/>
						<Button type='submit' disabled={isLoading || !address.trim()}>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Searching...
								</>
							) : (
								'Search'
							)}
						</Button>
					</div>
				</div>
			</form>

			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className='flex items-center space-x-1 text-sm text-muted-foreground cursor-pointer'>
							<p>
								Search results may not be accurate. Double check before using
							</p>
							<HelpCircle className='h-4 w-4' />
						</div>
					</TooltipTrigger>
					<TooltipContent className='max-w-xs p-4'>
						<p>
							Make sure to contact the business before selecting this place for
							your game. Enquire if they allow hosting board game sessions and
							ask about business hours beforehand to ensure the best experience
							for your group. You can search for the company website or Facebook
							page by selecting the globe icon next to the result
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			{searchResults.length > 0 ? (
				<ScrollArea className='h-[200px] w-full rounded-md border p-4'>
					{searchResults.map((location) => (
						<div key={location.place_id} className='mb-2 flex items-center'>
							<Button
								variant={
									selectedLocation?.id === location.place_id
										? 'secondary'
										: 'ghost'
								}
								className='flex-grow justify-start text-left p-2 hover:bg-accent'
								onClick={() => handleSelect(location)}
							>
								<div className='flex flex-col w-full'>
									<div className='flex items-center justify-between'>
										<div className='font-semibold'>
											{location.name}
											{selectedLocation?.id === location.place_id && (
												<span className='ml-2 text-sm text-green-500'>✓</span>
											)}
										</div>
										<div className='flex items-center'>
											<Star className='h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400' />
											<span className='text-sm'>
												{location.rating.toFixed(1)}
											</span>
										</div>
									</div>
									<div className='text-sm text-muted-foreground flex items-center'>
										<StoreIcon className='h-4 w-4 mr-2' />
										{location.formatted_address}
									</div>
								</div>
							</Button>
							<Button
								variant='ghost'
								size='icon'
								className='ml-2'
								onClick={() => handleGoogleSearch(location)}
								title='Search for this location on Google'
							>
								<Globe className='h-4 w-4' />
							</Button>
						</div>
					))}
				</ScrollArea>
			) : isLoading ? null : (
				<div className='text-center text-muted-foreground'>
					{address && !isLoading
						? 'No results found. Try expanding your search radius.'
						: 'Enter a zip code and search radius to find nearby game stores.'}
				</div>
			)}

			{selectedLocation && (
				<Button onClick={handleSave} className='w-full'>
					Save to My Locations
				</Button>
			)}
		</div>
	);
}
