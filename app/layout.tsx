import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/utilities/providers';
import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Rangers United',
	description:
		'Host your own game or connect with other local players to play Power Rangers Heroes of the Grid.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<Providers
						attribute='class'
						defaultTheme='dark'
						disableTransitionOnChange
					>
						<Header>{children}</Header>
						<Toaster />
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
