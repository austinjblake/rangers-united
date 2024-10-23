'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	getUserNotificationsAction,
	markNotificationAsReadAction,
	deleteNotificationAction,
	markAllNotificationsAsReadAction,
} from '@/actions/userNotifications-actions';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';

type Notification = {
	id: string;
	notification: string;
	createdAt: Date;
	isRead: boolean;
	gameId?: string;
};

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		const result = await getUserNotificationsAction();
		if (result.status === 'success' && result.data) {
			setNotifications(result.data);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to fetch notifications',
				variant: 'destructive',
			});
		}
	};

	const markAsRead = async (id: string) => {
		const result = await markNotificationAsReadAction(id);
		if (result.status === 'success') {
			setNotifications(
				notifications.map((notif) =>
					notif.id === id ? { ...notif, isRead: true } : notif
				)
			);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to mark notification as read',
				variant: 'destructive',
			});
		}
	};

	const deleteNotificationHandler = async (id: string) => {
		const result = await deleteNotificationAction(id);
		if (result.status === 'success') {
			setNotifications(notifications.filter((notif) => notif.id !== id));
		} else {
			toast({
				title: 'Error',
				description: 'Failed to delete notification',
				variant: 'destructive',
			});
		}
	};

	const markAllAsRead = async () => {
		const result = await markAllNotificationsAsReadAction();
		if (result.status === 'success') {
			setNotifications(
				notifications.map((notif) => ({ ...notif, isRead: true }))
			);
		} else {
			toast({
				title: 'Error',
				description: 'Failed to mark all notifications as read',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className='container mx-auto p-4 max-w-2xl'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold flex items-center'>
						<Bell className='mr-2' />
						Notifications
					</CardTitle>
					<CardDescription>Manage your notifications</CardDescription>
					<Button
						variant='outline'
						size='sm'
						onClick={markAllAsRead}
						className='mt-2 text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
						disabled={notifications.every((notif) => notif.isRead)}
					>
						Mark all as read
					</Button>
				</CardHeader>
				<CardContent>
					<ScrollArea className='h-[70vh] pr-4'>
						{notifications.length === 0 ? (
							<p className='text-center text-muted-foreground'>
								No notifications
							</p>
						) : (
							<ul className='space-y-4'>
								{notifications.map((notification) => (
									<li key={notification.id}>
										<Card className={notification.isRead ? 'bg-muted' : ''}>
											<CardContent className='p-4'>
												<div className='flex justify-between items-start'>
													<div className='space-y-1'>
														<p className='text-sm text-muted-foreground'>
															{notification.notification}
															{notification.gameId && (
																<Link
																	href={`/games/${notification.gameId}`}
																	className='ml-2 text-primary hover:underline inline-flex items-center'
																>
																	View <ArrowRight className='h-4 w-4 ml-1' />
																</Link>
															)}
														</p>
														<p className='text-xs text-muted-foreground'>
															{new Date(
																notification.createdAt
															).toLocaleString()}
														</p>
													</div>
													<div className='flex space-x-2'>
														{!notification.isRead && (
															<Button
																size='icon'
																variant='outline'
																onClick={() => markAsRead(notification.id)}
																aria-label='Mark as read'
																title='Mark as read'
																className='text-foreground hover:bg-primary/10 hover:text-primary transition-colors'
															>
																<Check className='h-4 w-4' />
															</Button>
														)}
														<Button
															size='icon'
															variant='outline'
															onClick={() =>
																deleteNotificationHandler(notification.id)
															}
															aria-label='Delete notification'
															title='Delete notification'
															className='text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors'
														>
															<Trash2 className='h-4 w-4' />
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									</li>
								))}
							</ul>
						)}
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
}
