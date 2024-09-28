'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { CheckSquare } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
	return (
		<header className='bg-primary text-primary-foreground shadow-md'>
			<div className='container mx-auto px-4 py-4 flex items-center justify-between'>
				<div className='flex items-center space-x-2'>
					<CheckSquare className='h-6 w-6' />
					<h1 className='text-xl font-bold'>Rangers United</h1>
				</div>
				<nav className='hidden md:flex space-x-4'>
					<Link href='/' className='hover:underline'>
						Home
					</Link>
					<SignedIn>
						<Link href='/dashboard' className='hover:underline'>
							Dashboard
						</Link>
					</SignedIn>
				</nav>
				<div className='flex items-center space-x-4'>
					<SignedOut>
						<SignInButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
			</div>
		</header>
	);
}
