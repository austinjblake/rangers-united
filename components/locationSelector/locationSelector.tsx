'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavedLocations } from './components/savedLocations';
import { NewLocation } from './components/newLocation';
import { FlgsSearch } from './components/flgsSearch';
import { LocationDetails } from './components/locationDetails';
import { Info } from 'lucide-react';
import { createLocation, geoLocateLocation } from '@/actions/locations-actions';
import { toast } from '@/components/ui/use-toast';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { SelectLocation } from '@/db/schema';
import { Button } from '@/components/ui/button';

interface LocationSelectorProps {
	type: 'searchGame' | 'hostGame';
	onUseLocation: (location: SelectLocation) => void;
	children?: React.ReactNode;
}

export default function LocationSelector({
	type,
	onUseLocation,
	children,
}: LocationSelectorProps) {
	const [selectedLocation, setSelectedLocation] =
		useState<SelectLocation | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [activeTab, setActiveTab] = useState('saved');
	const [saveError, setSaveError] = useState(false);

	const updateDetails = (updatedLocation: Partial<SelectLocation>) => {
		if (selectedLocation) {
			setSelectedLocation({
				...selectedLocation,
				...updatedLocation,
			});
		}
	};

	// set chosen location
	const handleLocationSelect = (location: SelectLocation | null) => {
		setSelectedLocation(location);
	};

	const handleTabChange = (value: string) => {
		setActiveTab(value);
		setSelectedLocation(null);
		setShowDetails(false);
		setSaveError(false);
	};

	const handleCancelDetails = () => {
		setShowDetails(false);
		setSelectedLocation(null);
		setSaveError(false);
	};

	// save location to database for user
	const handleSaveLocation = async (location: SelectLocation) => {
		try {
			const result = await createLocation({
				id: '',
				userId: '',
				name: location.name,
				location: location.location,
				isPrivate: location.isPrivate,
				isFLGS: location.isFLGS,
				readableAddress: location.readableAddress,
			});

			if (result.status === 'success') {
				toast({
					title: 'Location saved',
					description: 'Your location has been saved successfully.',
				});
				setShowDetails(false);
				setActiveTab('saved');
				setSelectedLocation({
					...result.data,
					name: result.data.name || '',
					isFLGS: result.data.isFLGS || false,
					isPrivate: result.data.isPrivate || false,
					temporary: result.data.temporary || null,
				});
				setSaveError(false);
			} else {
				toast({
					title: 'Error',
					description: `Failed to save location: ${result.message}`,
					variant: 'destructive',
					// Add tooltip here
				});
				setSaveError(true);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred while saving the location.',
				variant: 'destructive',
				// Add tooltip here
			});
			console.error('Error saving location:', error);
			setSaveError(true);
		}
	};

	const handleUseLocation = async () => {
		if (!selectedLocation) return;

		if (activeTab === 'saved') {
			// For saved locations, use the existing data
			onUseLocation(selectedLocation);
		} else {
			// For new locations or FLGS search results, geolocate
			const geoLocation = await geoLocateLocation(selectedLocation);
			onUseLocation(geoLocation.data);
		}
	};

	return (
		<Card className='w-full max-w-3xl mx-auto'>
			<CardHeader>
				<CardTitle>Select Location</CardTitle>
				<CardDescription>
					{type === 'hostGame' && 'Choose a location to host your game'}
					{type === 'searchGame' &&
						'Choose a location to search for a nearby game'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{!showDetails ? (
					<Tabs value={activeTab} onValueChange={handleTabChange}>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='saved'>Saved Locations</TabsTrigger>
							<TabsTrigger value='new'>New Location</TabsTrigger>
							<TabsTrigger value='flgs'>Search FLGS</TabsTrigger>
						</TabsList>
						<TabsContent value='saved'>
							<SavedLocations
								onSelect={handleLocationSelect}
								selectedLocation={selectedLocation}
							/>
						</TabsContent>
						<TabsContent value='new'>
							<NewLocation
								onSelect={handleLocationSelect}
								setShowDetails={setShowDetails}
							/>
						</TabsContent>
						<TabsContent value='flgs'>
							<FlgsSearch
								onSelect={handleLocationSelect}
								selectedLocation={selectedLocation}
								onSave={handleSaveLocation}
							/>
						</TabsContent>
					</Tabs>
				) : (
					<LocationDetails
						location={selectedLocation!}
						onSave={handleSaveLocation}
						onCancel={handleCancelDetails}
						saveError={saveError}
						updateDetails={updateDetails}
					/>
				)}
			</CardContent>
			{selectedLocation && (
				<CardFooter className='flex flex-col items-start gap-4'>
					<div className='flex items-center space-x-2 w-full'>
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
										Your exact location (such as your home address) will not be
										revealed to other users. The host will have full control
										over when and how to share specific details before the game
										starts.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					{children}
					<Button
						onClick={handleUseLocation}
						className='w-full'
						disabled={!selectedLocation}
					>
						{type === 'hostGame' && 'Use this location to host a game'}
						{type === 'searchGame' && 'Search for games near this location'}
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
