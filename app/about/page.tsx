// pages/about.js
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
	return (
		<div key='about-page' className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-3xl font-bold mb-6'>About Rangers United</h1>
			<p className='mb-8 text-muted-foreground'>
				Learn more about our mission to connect Power Rangers Heroes of the Grid
				players.
			</p>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Our Mission</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						Rangers United is dedicated to bringing Power Rangers Heroes of the
						Grid players together.
					</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>Connect players in local communities</li>
						<li>Facilitate game nights and meetups</li>
						<li>Foster a vibrant community of Power Rangers fans</li>
						<li>
							Support the growth of the Power Rangers Heroes of the Grid game
						</li>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Who We Are</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						We are passionate Power Rangers fans and board game enthusiasts who
						saw a need in the community.
					</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>Founded by long-time Power Rangers fans</li>
						<li>Supported by a community of dedicated players</li>
						<li>
							Created as a labor of love to give back to the community that has
							brought us so much joy over the years
						</li>
						<li>
							Rangers United is a fan-driven initiative, we are not officialy
							licensed or endorsed by Renegade Game Studios or Hasbro and make
							no copyright claims to the Power Rangers brand
						</li>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Our Values</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className='list-disc pl-6 mb-4'>
						<li>Community: Bringing players together</li>
						<li>
							Safety: Ensuring a secure environment for meetups and user privacy
						</li>
						<li>Inclusivity: Welcoming all Power Rangers fans</li>
						<li>Fun: Promoting enjoyable gaming experiences</li>
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle id='helpful-links'>Helpful Links</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						Find more information about Rangers United and Power Rangers Heroes
						of the Grid:
					</p>
					<ul className='space-y-2'>
						<li>
							<Link href='/help' className='text-primary hover:underline'>
								Rangers United Help Center
							</Link>
						</li>
						<li>
							<a
								href='https://rangerrandomizer.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline'
							>
								Ranger Randomizer - Easily pick random Ranger, Monsters, and
								more for your next game
							</a>
						</li>
						<li>
							<a
								href='https://www.oncearanger.com/heroes-of-the-grid/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline'
							>
								Once A Ranger - View all the cards for any set in the game
							</a>
						</li>
						<li>
							<a
								href='https://www.facebook.com/groups/powerrangersheroesofthegrid'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline'
							>
								Power Rangers Tabletop Gamers | Renegade Game Studios Facebook
								Group
							</a>
						</li>
						<li>
							<a
								href='https://boardgamegeek.com/boardgame/258148/power-rangers-heroes-of-the-grid'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline'
							>
								BoardGameGeek - Power Rangers Heroes of the Grid
							</a>
						</li>
						<li>
							<a
								href='https://renegadegamestudios.com/game-worlds/power-rangers/power-rangers-heroes-of-the-grid/'
								target='_blank'
								rel='noopener noreferrer'
								className='text-primary hover:underline'
							>
								Purchase Power Rangers Heroes of the Grid
							</a>
						</li>
					</ul>
				</CardContent>
			</Card>
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
