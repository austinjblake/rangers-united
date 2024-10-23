'use client';

import Link from 'next/link';
import {
	getBannedUsersForHostAction,
	unbanUserAction,
} from '@/actions/bannedUsers-actions';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
	const [bannedUsers, setBannedUsers] = useState<any[]>([]);

	useEffect(() => {
		const fetchBannedUsers = async () => {
			const bannedUsers = await getBannedUsersForHostAction();
			setBannedUsers(bannedUsers);
		};
		fetchBannedUsers();
	}, []);

	const handleUnban = async (bannedUserId: string) => {
		try {
			await unbanUserAction(bannedUserId);
			setBannedUsers((prevUsers) =>
				prevUsers.filter((user) => user.bannedUserId !== bannedUserId)
			);
			toast({
				title: 'User Unbanned',
				description: 'The user has been successfully unbanned.',
				variant: 'default',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to unban the user. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Account Settings</h1>

			<Link
				href='/notifications'
				className='text-blue-500 hover:underline mb-8 block'
			>
				View User Notifications
			</Link>

			<h2 className='text-xl font-semibold mb-4'>Banned Users</h2>

			<h3 className='text-sm text-gray-500 mb-2'>
				These users have been banned from joining any of your games.
			</h3>

			{bannedUsers.length === 0 ? (
				<p>No users have been banned.</p>
			) : (
				<ul className='space-y-4'>
					{bannedUsers.map((ban) => (
						<li key={ban.id} className='border p-4 rounded-lg'>
							<p>
								<strong>User:</strong> {ban.username}
							</p>
							<p>
								<strong>Date:</strong>{' '}
								{new Date(ban.createdAt || '').toLocaleDateString()}
							</p>
							<p>
								<strong>Reason:</strong> {ban.reason || 'No reason provided'}
							</p>
							<Button
								onClick={() => handleUnban(ban.bannedUserId)}
								className='mt-2'
							>
								Unban User
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
