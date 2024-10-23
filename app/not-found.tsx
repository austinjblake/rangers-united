'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SignedIn } from '@clerk/nextjs';

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-background text-foreground'>
			<h1 className='text-6xl font-bold mb-4'>404</h1>
			<p className='text-xl mb-8'>Page not found</p>
			<div className='flex gap-4'>
				<Button asChild>
					<Link href='/'>Go Home</Link>
				</Button>
				<SignedIn>
					<Button asChild variant='outline'>
						<Link href='/dashboard'>Go to Dashboard</Link>
					</Button>
				</SignedIn>
			</div>
		</div>
	);
}
