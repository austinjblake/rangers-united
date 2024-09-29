import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/utilities/providers';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import {
	createProfileAction,
	getProfileByUserIdAction,
} from '@/actions/profiles-actions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Rangers United',
	description:
		'Host your own or connect with other players to play Power Rangers Heroes of the Grid.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = auth();

	if (userId) {
		const profile = await getProfileByUserIdAction(userId);
		if (!profile) {
			await createProfileAction({ userId });
		}
	}

	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<Providers
						attribute='class'
						defaultTheme='dark'
						disableTransitionOnChange
					>
						<Header />
						{children}
						<Toaster />
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
