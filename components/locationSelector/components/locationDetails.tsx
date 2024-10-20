import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SelectLocation } from '@/db/schema';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type LocationDetailsProps = {
	location: SelectLocation;
	onSave: (location: SelectLocation) => void;
	onCancel: () => void;
	saveError: boolean;
	updateDetails: (updatedLocation: Partial<SelectLocation>) => void;
};

export function LocationDetails({
	location,
	onSave,
	onCancel,
	saveError,
	updateDetails,
}: LocationDetailsProps) {
	const [nickname, setNickname] = useState(location.name || '');
	const [locationType, setLocationType] = useState<'private' | 'flgs' | ''>(
		location.isFLGS ? 'flgs' : location.isPrivate ? 'private' : ''
	);

	const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newNickname = e.target.value;
		setNickname(newNickname);
		updateDetails({ name: newNickname });
	};

	const handleLocationTypeChange = (value: 'private' | 'flgs') => {
		setLocationType(value);
		updateDetails({
			isPrivate: value === 'private',
			isFLGS: value === 'flgs',
		});
	};

	const handleSave = () => {
		if (nickname.trim() === '') {
			return; // Prevent saving if nickname is empty
		}
		onSave({
			...location,
			name: nickname,
			isPrivate: locationType === 'private',
			isFLGS: locationType === 'flgs',
		});
	};

	return (
		<div className='space-y-4'>
			<div className='space-y-2'>
				<Label htmlFor='nickname'>Nickname *</Label>
				<Input
					id='nickname'
					placeholder='Enter a nickname for this location'
					value={nickname}
					onChange={handleNicknameChange}
					required
				/>
			</div>

			<RadioGroup value={locationType} onValueChange={handleLocationTypeChange}>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem value='private' id='private' />
					<Label htmlFor='private'>Private Location</Label>
				</div>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem value='flgs' id='flgs' />
					<Label htmlFor='flgs'>Friendly Local Game Store</Label>
				</div>
			</RadioGroup>

			<div className='pt-4'>
				<p className='text-sm text-muted-foreground mb-2'>
					{location.location}
				</p>
			</div>

			{saveError && (
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='flex items-center text-sm text-red-500 cursor-help'>
								<HelpCircle className='mr-2 h-4 w-4' />
								Double check your address and try again
							</div>
						</TooltipTrigger>
						<TooltipContent className='max-w-xs'>
							<p>
								If using a zip code, try using your full address. If problems
								persist, please contact support@rangersunited.com
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}

			<div className='flex justify-end space-x-2'>
				<Button
					variant='outline'
					onClick={onCancel}
					className='flex items-center'
				>
					<ArrowLeft className='mr-2' /> Back
				</Button>
				<Button onClick={handleSave} disabled={nickname?.trim() === ''}>
					Save to My Locations
				</Button>
			</div>
		</div>
	);
}
