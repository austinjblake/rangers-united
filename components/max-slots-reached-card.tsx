import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MaxSlotsReachedCard() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-md'>
			<Card className='text-center'>
				<CardHeader>
					<CardTitle className='flex items-center justify-center text-2xl text-yellow-600'>
						<AlertCircle className='w-6 h-6 mr-2' />
						Maximum Games Reached
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						You&apos;ve reached the maximum number of games you can host or join
						at this time.
					</p>
					<p className='text-sm text-gray-600'>
						To join a new game, you&apos;ll need to leave or delete one of your
						current games first.
					</p>
				</CardContent>
				<CardFooter className='flex justify-center'>
					<Button asChild>
						<Link href='/dashboard'>Go to Dashboard</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
