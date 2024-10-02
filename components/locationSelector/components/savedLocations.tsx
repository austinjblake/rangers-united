import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	getLocationsByUserId,
	deleteLocation,
} from '@/actions/locations-actions';
import { ConfirmationModal } from '@/components/confirmationModal';
import { Trash2Icon, HomeIcon, StoreIcon } from 'lucide-react';
import { SelectLocation } from '@/db/schema';
import { useToast } from '@/components/ui/use-toast';

interface SavedLocationsProps {
	onSelect: (location: SelectLocation) => void;
	selectedLocation: SelectLocation | null;
}

export function SavedLocations({
	onSelect,
	selectedLocation,
}: SavedLocationsProps) {
	const [locations, setLocations] = useState<SelectLocation[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [locationToDelete, setLocationToDelete] =
		useState<SelectLocation | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		fetchLocations();
	}, []);

	async function fetchLocations() {
		try {
			const fetchedLocations = await getLocationsByUserId();
			setLocations(fetchedLocations);
		} catch (err) {
			setError('Failed to fetch locations');
			console.error('Error fetching locations:', err);
		} finally {
			setIsLoading(false);
		}
	}

	const handleDeleteClick = (location: SelectLocation) => {
		setLocationToDelete(location);
		setIsDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (locationToDelete) {
			try {
				await deleteLocation(locationToDelete.id);
				setLocations(locations.filter((loc) => loc.id !== locationToDelete.id));
				toast({
					title: 'Location deleted',
					description: `${locationToDelete.name} has been successfully removed.`,
					variant: 'default',
				});
			} catch (err) {
				setError('Failed to delete location');
				console.error('Error deleting location:', err);
				toast({
					title: 'Error',
					description: 'Failed to delete location. Please try again.',
					variant: 'destructive',
				});
			}
		}
		setIsDeleteModalOpen(false);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;
	if (locations.length === 0) return <div>No saved locations found.</div>;

	return (
		<>
			<ScrollArea className='h-[150px] w-full rounded-md border p-4'>
				{locations.map((location) => (
					<div
						key={location.id}
						className='flex items-center justify-between mb-2'
					>
						<Button
							className='flex-grow justify-start text-left'
							variant={
								selectedLocation?.id === location.id ? 'secondary' : 'outline'
							}
							onClick={() => onSelect(location)}
						>
							<div className='flex items-center'>
								{location.isPrivate ? (
									<HomeIcon className='h-4 w-4 mr-2' />
								) : (
									<StoreIcon className='h-4 w-4 mr-2' />
								)}
								<div className='font-semibold'>
									{location.name}
									{selectedLocation?.id === location.id && (
										<span className='ml-2 text-sm text-green-500'>✓</span>
									)}
								</div>
							</div>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => handleDeleteClick(location)}
							className='ml-2'
						>
							<Trash2Icon className='h-4 w-4' />
						</Button>
					</div>
				))}
			</ScrollArea>
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				title='Delete Location'
				message={`Are you sure you want to delete ${locationToDelete?.name}?`}
			/>
		</>
	);
}
