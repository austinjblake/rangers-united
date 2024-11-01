import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	getLocationsByUserIdAction,
	deleteLocationAction,
} from '@/actions/locations-actions';
import { ConfirmationModal } from '@/components/confirmationModal';
import { Trash2Icon, HomeIcon, StoreIcon, RefreshCcwIcon } from 'lucide-react';
import { SelectLocation } from '@/db/schema';
import { useToast } from '@/components/ui/use-toast';
import { LocationIcon } from '@/components/location-icon';

interface SavedLocationsProps {
	onSelect: (location: SelectLocation | null) => void;
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
			const fetchedLocations = await getLocationsByUserIdAction();
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
				const deleteResult = await deleteLocationAction(locationToDelete.id);
				if (deleteResult.status === 'success') {
					setLocations(
						locations.filter((loc) => loc.id !== locationToDelete.id)
					);
					onSelect(null);
					toast({
						title: 'Location deleted',
						description: `${locationToDelete.name} has been successfully removed.`,
						variant: 'default',
					});
				} else throw new Error('Failed to delete location');
			} catch (err) {
				console.error('Error deleting location:', err);
				toast({
					title: 'Error',
					description:
						'Failed to delete location. This location is currently being used for a game you are hosting or have joined. You must delete these from My Games before you can remove this location. If you need more help, contact support@rangersunited.com',
					variant: 'destructive',
				});
			}
		}
		setIsDeleteModalOpen(false);
	};

	const handleRefresh = () => {
		setError(null);
		setIsLoading(true);
		fetchLocations();
	};

	if (isLoading) return <div>Loading...</div>;
	if (error)
		return (
			<div className='flex items-center justify-between'>
				<div>Error: {error}</div>
				<Button variant='outline' size='sm' onClick={handleRefresh}>
					<RefreshCcwIcon className='h-4 w-4 mr-2' />
					Refresh
				</Button>
			</div>
		);
	if (locations.length === 0) return <div>No saved locations found.</div>;

	return (
		<>
			<ScrollArea className='h-[175px] w-full rounded-md border p-4'>
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
							<div className='flex items-center w-full'>
								<LocationIcon
									isFLGS={location.isFLGS ?? false}
									isPrivate={location.isPrivate ?? false}
									className='h-4 w-4 mr-2 flex-shrink-0'
								/>
								<div className='flex flex-col overflow-hidden'>
									<div className='font-semibold truncate'>
										{location.name}
										{selectedLocation?.id === location.id && (
											<span className='ml-2 text-sm text-green-500'>✓</span>
										)}
									</div>
									<div className='text-sm text-gray-500 truncate'>
										{location.readableAddress}
									</div>
								</div>
							</div>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => handleDeleteClick(location)}
							className='ml-2 flex-shrink-0'
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
