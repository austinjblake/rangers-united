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
import { createLocation } from '@/actions/locations-actions';
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
	onUseLocation: (location: SelectLocation | SelectLocation[]) => void;
}

export default function LocationSelector({
	type,
	onUseLocation,
}: LocationSelectorProps) {
	const [selectedLocation, setSelectedLocation] =
		useState<SelectLocation | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const [activeTab, setActiveTab] = useState('saved');
	const [saveError, setSaveError] = useState(false);

	// set chosen location
	const handleLocationSelect = (location: SelectLocation) => {
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
			});

			if (result.status === 'success') {
				toast({
					title: 'Location saved',
					description: 'Your location has been saved successfully.',
				});
				setShowDetails(false);
				setActiveTab('saved');
				setSelectedLocation(location);
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
		console.log('Firing location function. selectedLocation', selectedLocation);
		onUseLocation(selectedLocation);
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
							/>
						</TabsContent>
					</Tabs>
				) : (
					<LocationDetails
						location={selectedLocation!}
						onSave={handleSaveLocation}
						onCancel={handleCancelDetails}
						saveError={saveError}
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
