'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Bell, Menu, Moon, Sun } from 'lucide-react';

export default function Component({ children }: { children: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [isDarkMode]);

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

	const NavLinks = () => (
		<>
			<Link
				href='/dashboard'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
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
				href='/profile'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
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
					<path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
					<circle cx='12' cy='12' r='3' />
				</svg>
				<span>Profile Settings</span>
			</Link>
			<Link
				href='/about'
				className='flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
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
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
							className='h-6 w-6 text-blue-500'
						>
							<rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
							<path d='M7 7h10' />
							<path d='M7 12h10' />
							<path d='M7 17h10' />
						</svg>
						<span className='text-xl font-bold'>Rangers United</span>
					</Link>
				</div>
				<div className='flex items-center space-x-4'>
					<Button variant='ghost' size='icon'>
						<Bell className='h-5 w-5' />
						<span className='sr-only'>Notifications</span>
					</Button>
					<Button variant='ghost' size='icon' onClick={toggleDarkMode}>
						{isDarkMode ? (
							<Sun className='h-5 w-5' />
						) : (
							<Moon className='h-5 w-5' />
						)}
						<span className='sr-only'>Toggle dark mode</span>
					</Button>
					<SignedIn>
						<UserButton
							userProfileMode='navigation'
							userProfileUrl='/profile'
						/>
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
								<NavLinks />
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
