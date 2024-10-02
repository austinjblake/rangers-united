import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SelectLocation } from '@/db/schema';
import { AddressInput } from './addressInput';

type NewLocationProps = {
	onSelect: (location: SelectLocation) => void;
	setShowDetails: (showDetails: boolean) => void;
};

export function NewLocation({ onSelect, setShowDetails }: NewLocationProps) {
	const [address, setAddress] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSelect({
			id: '',
			userId: '',
			name: '',
			location: address,
			isPrivate: true,
			isFLGS: false,
		});
		setShowDetails(true);
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<AddressInput onAddressChange={setAddress} />
			<Button type='submit' disabled={!address.trim()}>
				Continue
			</Button>
		</form>
	);
}
