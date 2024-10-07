'use client';

import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getNotificationByGameIdAction } from '@/actions/gameNotifications-actions';

interface GameNotificationsProps {
	gameId: string;
	notifications: any[];
}

export function GameNotifications({
	gameId,
	notifications,
}: GameNotificationsProps) {
	return (
		<div className='p-6'>
			<h2 className='text-xl font-semibold mb-4'>Game Notifications</h2>
			<ScrollArea className='h-[200px] w-full rounded-md border p-4 bg-secondary'>
				{notifications.map((notification) => (
					<div key={notification.id} className='mb-2 flex items-center text-sm'>
						<svg
							className='w-4 h-4 mr-2 text-primary'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
							/>
						</svg>
						<span className='font-medium'>{notification.message}</span>
						<span className='ml-auto text-xs text-muted-foreground'>
							{new Date(`${notification.created_at}Z`).toLocaleString()}
						</span>
					</div>
				))}
			</ScrollArea>
		</div>
	);
}
