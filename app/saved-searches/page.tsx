'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import LocationSelector from '@/components/locationSelector/locationSelector';
import { SelectLocation } from '@/db/schema';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/components/ui/use-toast';
import { SelectSavedSearch } from '@/db/schema/savedSearch-schema';
import {
	getSavedSearchesByUserIdAction,
	createSavedSearchAction,
	deleteSavedSearchAction,
} from '@/actions/savedSearch-actions';
import { LocationIcon } from '@/components/location-icon';

export default function SavedSearchesPage() {
	const [savedSearches, setSavedSearches] = useState<SelectSavedSearch[]>([]);
	const [searchRadius, setSearchRadius] = useState(10);
	const [searchLocation, setSearchLocation] = useState<SelectLocation | null>(
		null
	);
	const [showLocationSelector, setShowLocationSelector] = useState(true);

	useEffect(() => {
		const loadSavedSearches = async () => {
			const result = await getSavedSearchesByUserIdAction();
			if (result.status === 'success' && result.data) {
				setSavedSearches(result.data);
			}
		};
		loadSavedSearches();
	}, []);

	const handleLocationSelect = (location: SelectLocation) => {
		setSearchLocation(location);
		setShowLocationSelector(false);
	};

	const handleChangeLocation = () => {
		setSearchLocation(null);
		setShowLocationSelector(true);
	};

	const handleCreateSearch = async () => {
		if (!searchLocation) return;

		const result = await createSavedSearchAction({
			id: '',
			userId: '',
			locationId: searchLocation.id,
			radius: searchRadius,
		});

		if (result.status === 'success') {
			toast({
				title: 'Search Saved',
				description: 'Your search has been saved successfully.',
			});
			const searches = await getSavedSearchesByUserIdAction();
			if (searches.status === 'success' && searches.data) {
				setSavedSearches(searches.data);
			}
			setSearchLocation(null);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to save search.',
				variant: 'destructive',
			});
		}
	};

	const handleDeleteSearch = async (id: string) => {
		const result = await deleteSavedSearchAction(id);

		if (result.status === 'success') {
			toast({
				title: 'Search Deleted',
				description: 'Your saved search has been deleted.',
			});
			const searches = await getSavedSearchesByUserIdAction();
			if (searches.status === 'success' && searches.data) {
				setSavedSearches(searches.data);
			}
		} else {
			toast({
				title: 'Error',
				description: 'Failed to delete search.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>Your Saved Searches</h1>

			{savedSearches.length > 0 && (
				<div className='mb-8'>
					<h2 className='text-xl font-semibold mb-4'>Current Saved Searches</h2>
					{savedSearches.map((search) => (
						<Card key={search.id} className='mb-4'>
							<CardContent className='flex items-center justify-between py-4'>
								<div className='flex items-center gap-2'>
									<LocationIcon isFLGS={false} isPrivate={false} />
									<span>Within {search.radius} miles</span>
								</div>
								<Button
									variant='destructive'
									size='icon'
									onClick={() => handleDeleteSearch(search.id)}
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Card>
				<CardHeader>
					<CardTitle>Create New Saved Search</CardTitle>
					<CardDescription>
						Set up a new location and radius to monitor for games
					</CardDescription>
				</CardHeader>
				<CardContent>
					{showLocationSelector ? (
						<LocationSelector
							type='savedSearch'
							onUseLocation={handleLocationSelect}
						/>
					) : (
						searchLocation && (
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-2'>
										<LocationIcon isFLGS={false} isPrivate={false} />
										<span>{searchLocation.name}</span>
									</div>
									<Button variant='outline' onClick={handleChangeLocation}>
										Change Location
									</Button>
								</div>
								<div className='space-y-2'>
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
								<Button onClick={handleCreateSearch} className='w-full'>
									Save Search
								</Button>
							</div>
						)
					)}
				</CardContent>
			</Card>
		</div>
	);
}
