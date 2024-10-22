import Link from 'next/link';
import { getBanReasonAction } from '@/actions/bannedUsers-actions';

export default async function BannedPage({
	params,
}: {
	params: { gameId: string };
}) {
	const banReason = await getBanReasonAction(params.gameId);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			<div className='max-w-md p-8 bg-white rounded-lg shadow-md'>
				<h1 className='text-3xl font-bold text-red-600 mb-4'>Account Banned</h1>
				<p className='text-gray-700 mb-4'>
					We regret to inform you that you have been banned from a game. As a
					result:
				</p>
				<ul className='list-disc list-inside text-gray-700 mb-6'>
					<li>
						You will no longer be able to join any games from the host that
						banned you.
					</li>
					<li>Your access to certain features may be restricted.</li>
					<li>
						This ban is specific to the host and does not affect your entire
						account.
					</li>
				</ul>
				{banReason && (
					<p className='text-gray-700 mb-6'>
						<strong>Reason for ban:</strong> {banReason}
					</p>
				)}
				<p className='text-gray-700 mb-6'>
					If you believe this ban was issued in error, please contact our
					support team for assistance.
				</p>
				<Link
					href='/dashboard'
					className='inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors'
				>
					Return to Dashboard
				</Link>
			</div>
		</div>
	);
}
