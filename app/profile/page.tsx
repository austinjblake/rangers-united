'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2, CheckCircle } from 'lucide-react';
import {
	getProfileByUserIdAction,
	updateProfileAction,
} from '@/actions/profiles-actions';
import { SelectProfile } from '@/db/schema/profiles-schema';

export default function UserProfile() {
	const { user } = useUser();
	const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
	const [editMode, setEditMode] = useState<Record<string, boolean>>({});
	const [profile, setProfile] = useState<SelectProfile | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			if (user?.id) {
				const result = await getProfileByUserIdAction(user.id);
				if (result.status === 'success' && result.data) {
					setProfile(result.data as SelectProfile);
				}
			}
		};
		fetchProfile();
	}, [user?.id]);

	const handleEdit = (field: string) => {
		setEditMode((prev) => ({ ...prev, [field]: true }));
	};

	const handleSave = async (field: string) => {
		setIsLoading((prev) => ({ ...prev, [field]: true }));
		try {
			if (field === 'email') {
				await user?.setPrimaryEmailAddress({
					emailAddress: profile?.email || '',
				});
			} else if (field === 'username') {
				await user?.update({ username: profile?.username || '' });
			} else if (profile) {
				const result = await updateProfileAction(profile.userId, {
					[field]: profile[field as keyof SelectProfile],
				});
				if (result.status === 'error') throw new Error(result.message);
			}
			setEditMode((prev) => ({ ...prev, [field]: false }));
			toast({
				title: 'Success',
				description: `${
					field.charAt(0).toUpperCase() + field.slice(1)
				} updated successfully.`,
				duration: 3000,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: 'Error',
				description: `Failed to update ${field}. Please try again.`,
				duration: 3000,
			});
		} finally {
			setIsLoading((prev) => ({ ...prev, [field]: false }));
		}
	};

	const renderField = (
		label: string,
		field: keyof SelectProfile,
		type: string = 'text'
	) => (
		<div className='space-y-2'>
			<Label htmlFor={field}>{label}</Label>
			<div className='flex items-center space-x-2'>
				{editMode[field] ? (
					<>
						{type === 'select' ? (
							<Select
								value={profile?.[field] as string}
								onValueChange={(value) =>
									setProfile((prev) =>
										prev ? { ...prev, [field]: value } : null
									)
								}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select...' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='free'>Free</SelectItem>
									<SelectItem value='pro'>Pro</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<Input
								id={field}
								type={type}
								value={profile?.[field] as string}
								onChange={(e) =>
									setProfile((prev) =>
										prev ? { ...prev, [field]: e.target.value } : null
									)
								}
								className='flex-grow'
							/>
						)}
						<Button
							onClick={() => handleSave(field)}
							disabled={isLoading[field]}
						>
							{isLoading[field] ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<CheckCircle className='mr-2 h-4 w-4' />
							)}
							Save
						</Button>
					</>
				) : (
					<>
						<Input
							id={field}
							type={type}
							value={profile?.[field] as string}
							readOnly
							className='flex-grow'
						/>
						<Button variant='outline' onClick={() => handleEdit(field)}>
							Edit
						</Button>
					</>
				)}
			</div>
		</div>
	);

	if (!profile) {
		return <div>Loading...</div>;
	}

	return (
		<div className='container mx-auto py-10'>
			<Card className='w-full max-w-2xl mx-auto'>
				<CardHeader>
					<CardTitle>User Profile</CardTitle>
					<CardDescription>
						Manage your account information and preferences
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-6'>
					{renderField('Email', 'email', 'email')}
					{renderField('Username', 'username')}
					{/* {renderField('Membership', 'membership', 'select')} */}
				</CardContent>
			</Card>
		</div>
	);
}
