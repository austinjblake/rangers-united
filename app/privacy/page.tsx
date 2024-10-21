// pages/privacy.js
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicy() {
	return (
		<div key='privacy-page' className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-3xl font-bold mb-6'>Privacy Policy</h1>
			<p className='mb-8 text-muted-foreground'>
				At Rangers United, we value your privacy. This policy outlines how we
				collect, use, and protect your personal information.
			</p>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>1. Information We Collect</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We collect information you provide directly to us, such as your
						name, email address, and location when you create an account or use
						our services.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>2. How We Use Your Information</CardTitle>
				</CardHeader>
				<CardContent>
					<p>We use your information to:</p>
					<ul className='list-disc pl-6 mt-2'>
						<li>Provide and improve our services</li>
						<li>Communicate with you about your account and our services</li>
						<li>Personalize your experience on our platform</li>
						<li>Analyze usage patterns and trends</li>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>3. Information Sharing</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We do not sell or rent your personal information to third parties.
						We may share your information with other users as necessary to
						facilitate game meetups and with service providers who assist us in
						operating our platform.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>4. Data Security</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We implement reasonable security measures to protect your personal
						information from unauthorized access, alteration, disclosure, or
						destruction.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>5. Your Choices</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						You can access, update, or delete your account information at any
						time through your account settings. You may also opt-out of certain
						communications from us.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>6. Cookies and Tracking Technologies</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We use cookies and similar tracking technologies to enhance your
						experience on our platform. You can adjust your browser settings to
						refuse cookies, but this may limit some features of our service.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>7. Changes to This Policy</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We may update this privacy policy from time to time. We will notify
						you of any significant changes by posting the new policy on this
						page.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Contact Us</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						If you have any questions about this Privacy Policy, please contact
						us at{' '}
						<a
							href='mailto:support@rangersunited.com'
							className='text-primary hover:underline'
						>
							support@rangersunited.com
						</a>
						.
					</p>
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
