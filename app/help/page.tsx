// pages/help.js
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import dashboardImg from './dashboard.webp';
import detailsImg from './details1.webp';
import chatImg from './chat.webp';
import flgsImg from './flgs.webp';
import notificationsImg from './notifications.webp';
import searchImg from './search.webp';
import fulladdressImg from './fulladdress.webp';

export default function Help() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-3xl font-bold mb-6'>
				Help & How To Use Rangers United
			</h1>
			<p className='mb-8 text-muted-foreground'>
				Need help getting started? Follow this guide to learn how to use Rangers
				United and start connecting with other players quickly.
			</p>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Step 1: Sign Up and View Your Games Dashboard</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						To begin, create an account by clicking on the &quot;Sign Up&quot;
						button on the homepage.
					</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>Fill in your email, username, and password</li>
						<li>
							Your username is what other players will see when you join a game,
							so choose a good one! You can always change it later.
						</li>
						<li>
							Verify your account with the email we send you after you sign up.
						</li>
						<li>You&apos;re ready to go!</li>
						<li>
							Once signed up, you&apos;ll be redirected to your games dashboard
						</li>
						<li>Easily track your upcoming games and create new ones</li>
						<li>
							Your dashboard shows all the important info for your upcoming
							games, including your status as Hosting or Joined and the
							date/time details and an approximate location for the game along
							with the number of players currently added to the game
						</li>
						<li>
							Each user gets 5 game slots to fill by either hosting or joining
							games
						</li>
					</ul>
					<Image
						src={dashboardImg}
						alt='Games dashboard screenshot'
						width={600}
						height={400}
						className='rounded-lg'
					/>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Step 2: Search for or Host a Game</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						You can either search for available games in your area or create
						your own.
					</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>
							Click on the &quot;Find a Game&quot; or &quot;Host a Game&quot;
							button to get started.
						</li>
						<li>Enter a location to host your game or to use for searching.</li>
						<li>
							Use your zip code or enter the full address for a more specific
							location, then specify the distance you&apos;re willing to travel
							when looking for a game to join.
						</li>
						<Image
							src={fulladdressImg}
							alt='Address entry screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
						<li>
							If you can&apos;t host at your home, check out the FLGS tab to
							find Friendly Local Game Stores near you to host your game night
							at. Make sure to contact your store for availability first! The
							globe icon next to the FLGS result will help you find store info
							quickly.
						</li>
						<Image
							src={flgsImg}
							alt='FLGS search screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
						<li>
							You can save your locations to your profile for easy access. Mark
							it as a Private Residence or FLGS for others to see.
						</li>
						<li>
							Your exact location will be kept private. Joiners to a game will
							only see an approximate distance from the location they used to
							search to where the host is. Hosts cannot see joiner locations.
						</li>
						<li>
							If you&apos;re creating a new game to host, select the date and
							time for your game. Then click &quot;Create Game&quot; and
							you&apos;re done!
						</li>
						<li>
							If you&apos;re searching for a nearby game to join, you can sort
							through the results by date or location type. Once you find one
							that works for you, click &quot;Join&quot; and you&apos;re on your
							way!
						</li>
						<Image
							src={searchImg}
							alt='Search results screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Step 3: Chat and Coordinate</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>Once you&apos;re in the game:</p>
					<ul className='list-disc pl-6 mb-4'>
						<li>
							See all the important game details right at the top of the page
						</li>
						<Image
							src={detailsImg}
							alt='Game details screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
						<li>
							Use the real-time chat to communicate with the host and other
							players.
						</li>
						<li>
							Drum up excitement for the game by sharing your favorite rangers
							or enemies.
						</li>
						<li>
							Let everyone know what game expansions you can bring and what
							you&apos;d like to see in the game.
						</li>
						<li>
							Discuss the game time. Try to find a time that works for everyone!
						</li>
						<Image
							src={chatImg}
							alt='Chat screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
						<li>
							Confirm the location. It will be up to the host to inform the
							group in the chat about the specific address for the game, once
							players are ready to go and the game is about to begin
						</li>
						<li>
							Check out any other important details in the game notifications
							section below
						</li>
						<Image
							src={notificationsImg}
							alt='Notifications screenshot'
							width={600}
							height={400}
							className='rounded-lg'
						/>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Step 4: Play!</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						Once all the details are set, meet up at the designated location and
						play an epic game of Power Rangers Heroes of the Grid!
					</p>
				</CardContent>
			</Card>

			<Separator className='my-8' />

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>Frequently Asked Questions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						<div>
							<h3 className='font-semibold'>
								Is my personal information safe?
							</h3>
							<p>
								Yes, we take privacy seriously. Your exact location is never
								shared with other users. Your username is visible to other users
								but your email stays private as well.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								Can I leave a game I&apos;ve joined?
							</h3>
							<p>
								Yes, you can leave a game at any time from your dashboard or the
								game details page.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								Can I cancel a game I&apos;m hosting?
							</h3>
							<p>
								Yes, you can delete a game at any time from your dashboard or
								the game details page. Any users who have already joined will be
								notified of the game deletion.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								Can I change the date/time or location of a game I&apos;m
								hosting?
							</h3>
							<p>
								Yes, you can edit the date/time or location of a game from your
								dashboard or the game details page. Any users who have already
								joined will be able to see the changes and a notification will
								be added to the game details.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								Can I remove something I shared in the chat?
							</h3>
							<p>
								You can edit delete your own messages in the chat at any time.
								The host also has the ability to delete any chat messages from
								their game. If you leave a game or delete your account, all of
								your messages will be deleted also. Hovering your mouse over the
								top right of a message will show the buttons to edit or delete a
								message.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								I&apos;m hosting a game and we have enough players, can I
								prevent new players from joining?
							</h3>
							<p>
								Yes, you can do this by clicking the &quot;Mark as Full&quot;
								button on your game details page or directly from your
								dashboard. This mark the game with a Full icon and no new
								players will be allowed to join. Your game will still show up in
								search results. To open the game back up to new players, simply
								click the &quot;Open Game&quot; button.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								I created a game but it&apos;s not showing up when I search for
								games near that location.
							</h3>
							<p>
								Searching for games to join only returns games that you are not
								hosting. Don&apos;t worry, your game is out there for others to
								find!
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								I joined a game but now it&apos;s not showing up on my dashboard
								and the game details page says not found.
							</h3>
							<p>
								The host may have deleted the game. Check your notifications
								bell in the header at the top right of the screen to check your
								user notifications to see if any games you joined have been
								deleted.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								I want to add another game but I already have all 5 slots
								filled.
							</h3>
							<p>
								Users are limited to 5 games at a time. If you want to add
								another game, you&apos;ll need to delete or leave an existing
								game.
							</p>
						</div>
						<div>
							<h3 className='font-semibold'>
								Can I use Rangers United for other board games?
							</h3>
							<p>
								Rangers United is focused on Power Rangers Heroes of the Grid
								only, this is a gift to the community to focus on bringing
								people together and a thank you to Renegade Games for creating
								such an amazing game.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Need More Help?</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						If you have any questions or run into any issues, feel free to
						contact us. We&apos;re happy to help!
					</p>
					<Button asChild>
						<a href='mailto:support@rangersunited.com'>Contact Support</a>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
