'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Bell, BellRing, Menu, Moon, Shield, Sun } from 'lucide-react';
import {
	getUserNotificationsAction,
	markNotificationsAsReadAction,
} from '@/actions/userNotifications-actions';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Component({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [notifications, setNotifications] = useState<any[]>([]);
	const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const fetchNotifications = async () => {
		const result = await getUserNotificationsAction();
		if (result.status === 'success' && result.data) {
			setNotifications(result.data);
			setHasUnreadNotifications(
				result.data.some((notification: any) => !notification.isRead)
			);
		}
	};

	useEffect(() => {
		fetchNotifications(); // Refetch on URL change
	}, [pathname, searchParams]);

	useEffect(() => {
		const interval = setInterval(() => {
			fetchNotifications(); // Periodically fetch notifications
		}, 5 * 60 * 1000); // Every 5 minutes

		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const toggleDarkMode = () => setTheme(theme === 'dark' ? 'light' : 'dark');

	const formatNotification = (notification: string) => {
		const dateTimeRegex =
			/(\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4})/;
		const match = notification.match(dateTimeRegex);

		if (match) {
			const dateTimeString = match[1];
			const date = new Date(dateTimeString);
			const formattedDate = date.toLocaleString();
			return notification.replace(dateTimeString, formattedDate);
		}

		return notification;
	};

	const handleNotificationClick = async () => {
		const unreadNotifications = notifications
			.filter((notification: any) => !notification.isRead)
			.slice(0, 3);
		if (unreadNotifications.length > 0) {
			const ids = unreadNotifications.map(
				(notification: any) => notification.id
			);
			await markNotificationsAsReadAction(ids);
			fetchNotifications(); // Refetch to update the UI
		}
	};

	const closeSidebar = () => setIsSidebarOpen(false);

	const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
		<>
			<Link
				href='/dashboard'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				onClick={onLinkClick}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<rect width='7' height='9' x='3' y='3' rx='1' />
					<rect width='7' height='5' x='14' y='3' rx='1' />
					<rect width='7' height='9' x='14' y='12' rx='1' />
					<rect width='7' height='5' x='3' y='16' rx='1' />
				</svg>
				<span>My Games</span>
			</Link>
			<Link
				href='/join-game'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				onClick={onLinkClick}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<circle cx='11' cy='11' r='8' />
					<path d='m21 21-4.3-4.3' />
				</svg>
				<span>Find Games</span>
			</Link>
			<Link
				href='/host-game'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				onClick={onLinkClick}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
					<path d='m15 5 4 4' />
				</svg>
				<span>Host a Game</span>
			</Link>
			<Link
				href='/about'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				onClick={onLinkClick}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<circle cx='12' cy='12' r='10' />
					<path d='M12 16v-4' />
					<path d='M12 8h.01' />
				</svg>
				<span>About</span>
			</Link>
			<Link
				href='/help'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
				onClick={onLinkClick}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				>
					<circle cx='12' cy='12' r='10' />
					<path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
					<path d='M12 17h.01' />
				</svg>
				<span>Help</span>
			</Link>
		</>
	);

	const handleViewAllNotifications = () => {
		setIsSidebarOpen(false); // Close the sidebar if it's open
		setIsPopoverOpen(false); // Close the popover
		router.push('/notifications');
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className='flex flex-col min-h-screen'>
			<header className='flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b'>
				<div className='flex items-center space-x-4'>
					<SignedIn>
						<Button
							variant='ghost'
							size='icon'
							className='lg:hidden'
							onClick={toggleSidebar}
						>
							<Menu className='h-6 w-6' />
							<span className='sr-only'>Toggle navigation menu</span>
						</Button>
					</SignedIn>
					<Link href='/' className='flex items-center space-x-2'>
						<Shield className='h-6 w-6 text-yellow-500 dark:text-yellow-400' />
						<span className='text-xl font-bold'>Rangers United</span>
					</Link>
				</div>
				<div className='flex items-center space-x-4'>
					<SignedIn>
						<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
							<PopoverTrigger asChild>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => {
										setIsPopoverOpen(true);
										handleNotificationClick();
									}}
								>
									{hasUnreadNotifications ? (
										<BellRing className='h-5 w-5' color='red' />
									) : (
										<Bell className='h-5 w-5' />
									)}
									<span className='sr-only'>Notifications</span>
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-80 p-0'>
								<div className='p-4 space-y-4'>
									<h3 className='font-medium'>Notifications</h3>
									{notifications.length > 0 ? (
										<>
											<div className='space-y-2'>
												{notifications
													.slice(0, 3)
													.map((notification, index) => (
														<div
															key={index}
															className='text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700'
														>
															{formatNotification(notification.notification)}
														</div>
													))}
											</div>
											<Button
												className='w-full mt-2'
												onClick={handleViewAllNotifications}
											>
												View all notifications
											</Button>
										</>
									) : (
										<p className='text-sm text-gray-500'>
											No notifications at this time.
										</p>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</SignedIn>
					<Button variant='ghost' size='icon' onClick={toggleDarkMode}>
						{theme === 'dark' ? (
							<Sun className='h-5 w-5' />
						) : (
							<Moon className='h-5 w-5' />
						)}
						<span className='sr-only'>Toggle dark mode</span>
					</Button>
					<SignedIn>
						<UserButton />
					</SignedIn>
					<SignedOut>
						<SignInButton />
					</SignedOut>
				</div>
			</header>
			<div className='flex flex-1'>
				<SignedIn>
					<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
						<SheetContent
							side='left'
							className='w-[300px] sm:w-[400px] lg:hidden'
						>
							<nav className='flex flex-col space-y-2 mt-4'>
								<NavLinks onLinkClick={closeSidebar} />
							</nav>
						</SheetContent>
					</Sheet>
					<aside className='hidden lg:flex flex-col w-64 border-r bg-gray-50 dark:bg-gray-900'>
						<nav className='flex flex-col space-y-2 p-4'>
							<NavLinks />
						</nav>
					</aside>
				</SignedIn>
				<main className='flex-1 p-4'>{children}</main>
			</div>
		</div>
	);
}
