import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

type AddressInputProps = {
	onAddressChange: (address: string) => void;
};

export function AddressInput({ onAddressChange }: AddressInputProps) {
	const [locationType, setLocationType] = useState<'zip' | 'full'>('zip');
	const [zipCode, setZipCode] = useState('');
	const [country, setCountry] = useState('');
	const [region, setRegion] = useState('');
	const [streetAddress, setStreetAddress] = useState('');
	const [city, setCity] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const resetAddressStates = () => {
		setZipCode('');
		setCountry('');
		setRegion('');
		setStreetAddress('');
		setCity('');
		setPostalCode('');
		onAddressChange('');
	};

	const handleAddressChange = (newValue: string, field: string) => {
		let address: string;
		if (locationType === 'zip') {
			address = field === 'zipCode' ? newValue : zipCode;
		} else {
			const updatedFields = {
				streetAddress,
				city,
				region,
				postalCode,
				country,
				[field]: newValue,
			};
			address = `${updatedFields.streetAddress}, ${updatedFields.city}, ${updatedFields.region}, ${updatedFields.postalCode}, ${updatedFields.country}`;
		}
		onAddressChange(address);
	};

	return (
		<div className='space-y-4'>
			<RadioGroup
				defaultValue='zip'
				onValueChange={(value) => {
					setLocationType(value as 'zip' | 'full');
					resetAddressStates();
				}}
			>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem value='zip' id='zip' />
					<Label htmlFor='zip'>Zip Code (U.S.)</Label>
				</div>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem value='full' id='full' />
					<Label htmlFor='full'>Full Address</Label>
				</div>
			</RadioGroup>

			{locationType === 'zip' ? (
				<div className='space-y-2'>
					<Label htmlFor='zipCode'>Zip Code</Label>
					<Input
						id='zipCode'
						placeholder='Enter zip code'
						value={zipCode}
						onChange={(e) => {
							setZipCode(e.target.value);
							handleAddressChange(e.target.value, 'zipCode');
						}}
					/>
				</div>
			) : (
				<>
					<CountryDropdown
						value={country}
						onChange={(val) => {
							setCountry(val);
							handleAddressChange(val, 'country');
						}}
						classes='w-full p-2 border rounded'
						priorityOptions={['US']}
					/>
					<RegionDropdown
						country={country}
						value={region}
						onChange={(val) => {
							setRegion(val);
							handleAddressChange(val, 'region');
						}}
						classes='w-full p-2 border rounded'
					/>
					<Input
						placeholder='Street Address'
						value={streetAddress}
						onChange={(e) => {
							setStreetAddress(e.target.value);
							handleAddressChange(e.target.value, 'streetAddress');
						}}
					/>
					<Input
						placeholder='City'
						value={city}
						onChange={(e) => {
							setCity(e.target.value);
							handleAddressChange(e.target.value, 'city');
						}}
					/>
					<Input
						placeholder='Postal Code'
						value={postalCode}
						onChange={(e) => {
							setPostalCode(e.target.value);
							handleAddressChange(e.target.value, 'postalCode');
						}}
					/>
				</>
			)}
		</div>
	);
}
