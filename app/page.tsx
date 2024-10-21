import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Users, MapPin, MessageCircle, Calendar, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
	return (
		<div
			key='landing-page'
			className='flex flex-col min-h-screen bg-background text-foreground'
		>
			<main className='flex-1'>
				<section className='w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary'>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-gray-900 dark:text-white'>
									Welcome to Rangers United
								</h1>
								<p className='mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl'>
									Your Gateway to Finding Power Rangers: Heroes of the Grid
									Gaming Groups!
								</p>
							</div>
							<div className='space-y-2'>
								<p className='text-gray-600 dark:text-gray-400'>
									Looking for your next epic game night? Tired of scrolling
									through endless forums just to find a group? Rangers United is
									here to simplify the process and get you in the game faster
									than ever!
								</p>
							</div>
							<div className='w-full max-w-sm space-y-4'>
								<div className='flex items-center justify-center space-x-4'>
									<Link href='/signup' className='flex-1'>
										<Button className='w-full py-6 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-gray-900 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-gray-900 transition-colors duration-200 shadow-lg hover:shadow-xl'>
											Sign Up Now
										</Button>
									</Link>
									<span className='text-gray-600 dark:text-gray-400 font-medium'>
										or
									</span>
									<Link href='/login' className='flex-1'>
										<Button
											variant='outline'
											className='w-full py-6 text-lg font-semibold bg-transparent hover:bg-gray-100 text-gray-900 dark:bg-transparent dark:hover:bg-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl'
										>
											Sign In
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section
					className='w-full py-12 md:py-24 lg:py-32 bg-background'
					id='features'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white'>
							Why Choose Us?
						</h2>
						<div className='grid gap-10 sm:grid-cols-2 md:grid-cols-3'>
							<Card className='bg-gray-50 dark:bg-gray-800'>
								<CardContent className='flex flex-col items-center space-y-2 p-6'>
									<MapPin className='h-12 w-12 text-yellow-500 dark:text-yellow-400' />
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										Find Nearby Games
									</h3>
									<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
										Search for games based on your location, whether at a local
										game store or someone&apos;s home.
									</p>
								</CardContent>
							</Card>
							<Card className='bg-gray-50 dark:bg-gray-800'>
								<CardContent className='flex flex-col items-center space-y-2 p-6'>
									<Users className='h-12 w-12 text-yellow-500 dark:text-yellow-400' />
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										Host or Join Games
									</h3>
									<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
										Easily create or join existing sessions with a few clicks.
										Customize your game times and slots to fit your schedule.
									</p>
								</CardContent>
							</Card>
							<Card className='bg-gray-50 dark:bg-gray-800'>
								<CardContent className='flex flex-col items-center space-y-2 p-6'>
									<MessageCircle className='h-12 w-12 text-yellow-500 dark:text-yellow-400' />
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										Real-Time Communication
									</h3>
									<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
										Coordinate with your group through our in-app chat. Share
										your ideas to make a great game night and stay up-to-date
										with game changes, new joiners, and all the important
										details.
									</p>
								</CardContent>
							</Card>
							<Card className='bg-gray-50 dark:bg-gray-800'>
								<CardContent className='flex flex-col items-center space-y-2 p-6'>
									<Calendar className='h-12 w-12 text-yellow-500 dark:text-yellow-400' />
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										Track Multiple Games
									</h3>
									<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
										Get organized with multiple game slots, notifications, and
										history all in one place.
									</p>
								</CardContent>
							</Card>
							<Card className='bg-gray-50 dark:bg-gray-800'>
								<CardContent className='flex flex-col items-center space-y-2 p-6'>
									<Shield className='h-12 w-12 text-yellow-500 dark:text-yellow-400' />
									<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
										Designed for Fans
									</h3>
									<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
										Tailored specifically for Power Rangers: Heroes of the Grid,
										ensuring you find the right community.
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
				<section
					className='w-full py-12 md:py-24 lg:py-32 bg-secondary'
					id='how-it-works'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white'>
							How It Works
						</h2>
						<div className='grid gap-6 lg:grid-cols-4'>
							<div className='flex flex-col items-center space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-400 text-gray-900'>
									1
								</div>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
									Sign Up
								</h3>
								<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
									Create an account to access all the features.
								</p>
							</div>
							<div className='flex flex-col items-center space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-400 text-gray-900'>
									2
								</div>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
									Host or Join a Game
								</h3>
								<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
									Use your address or search for a nearby Friendly Local Game
									Store (FLGS). Then use this location to host or look for a
									nearby game to join.
								</p>
							</div>
							<div className='flex flex-col items-center space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-400 text-gray-900'>
									3
								</div>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
									Get the Details
								</h3>
								<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
									Chat with the host and players directly. Exchange info on what
									expansions everyone has and wants to play. View the date and
									time for the game and check notifications for any updates.
								</p>
							</div>
							<div className='flex flex-col items-center space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
								<div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 dark:bg-yellow-400 text-gray-900'>
									4
								</div>
								<h3 className='text-xl font-bold text-gray-900 dark:text-white'>
									It&apos;s Morphin Time!
								</h3>
								<p className='text-center text-sm text-gray-600 dark:text-gray-400'>
									Meet up, play, and have a blast!
								</p>
							</div>
						</div>
					</div>
				</section>
				<section
					className='w-full py-12 md:py-24 lg:py-32 bg-background'
					id='learn-more'
				>
					<div className='container px-4 md:px-6'>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white'>
							Learn More
						</h2>
						<div className='flex flex-col sm:flex-row justify-center items-center gap-6'>
							<Link href='/about'>
								<Button className='w-full sm:w-auto py-4 px-6 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-gray-900 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-gray-900 transition-colors duration-200 shadow-lg hover:shadow-xl'>
									About Us
								</Button>
							</Link>
							<Link href='/help'>
								<Button
									variant='outline'
									className='w-full sm:w-auto py-4 px-6 text-lg font-semibold bg-transparent hover:bg-gray-100 text-gray-900 dark:bg-transparent dark:hover:bg-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl'
								>
									Help Center
								</Button>
							</Link>
						</div>
					</div>
				</section>
				<section
					className='w-full py-12 md:py-24 lg:py-32 bg-secondary'
					id='sign-up'
				>
					<div className='container px-4 md:px-6'>
						<div className='flex flex-col items-center space-y-4 text-center'>
							<div className='space-y-2'>
								<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-white'>
									What Are You Waiting For?
								</h2>
								<p className='mx-auto max-w-[600px] text-gray-600 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
									Discover new gaming friends, experience more epic moments, and
									simplify your game planning!
								</p>
							</div>
							<div className='w-full max-w-sm space-y-4'>
								<div className='flex items-center justify-center space-x-4'>
									<Link href='/signup' className='flex-1'>
										<Button className='w-full py-6 text-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-gray-900 dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-gray-900 transition-colors duration-200 shadow-lg hover:shadow-xl'>
											Sign Up Now
										</Button>
									</Link>
									<span className='text-gray-600 dark:text-gray-400 font-medium'>
										or
									</span>
									<Link href='/login' className='flex-1'>
										<Button
											variant='outline'
											className='w-full py-6 text-lg font-semibold bg-transparent hover:bg-gray-100 text-gray-900 dark:bg-transparent dark:hover:bg-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 transition-colors duration-200 shadow-lg hover:shadow-xl'
										>
											Sign In
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className='py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted text-muted-foreground'>
				<p className='text-xs'>© 2024 Rangers United. All rights reserved.</p>
				<nav className='sm:ml-auto flex gap-4 sm:gap-6'>
					<Link
						className='text-xs hover:underline underline-offset-4'
						href='/terms'
					>
						Terms of Service
					</Link>
					<Link
						className='text-xs hover:underline underline-offset-4'
						href='/privacy'
					>
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
