import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
	return (
		<div className='container mx-auto px-4 py-8 max-w-3xl'>
			<h1 className='text-3xl font-bold mb-6'>Terms of Service</h1>
			<p className='mb-8 text-muted-foreground'>
				Please review our terms of service carefully. By using Rangers United,
				you agree to comply with these terms.
			</p>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>1. Acceptance of Terms</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						By using Rangers United, you agree to be legally bound by these
						terms. If you do not agree to these terms, you are not permitted to
						use our service.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>2. User Responsibilities</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						You are responsible for maintaining the confidentiality of your
						account information, including your username and password. You agree
						to immediately notify us of any unauthorized use of your account or
						any other security breach.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>3. Prohibited Activities</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='mb-4'>
						You agree not to engage in activities that may harm or interfere
						with the operation of Rangers United or the experience of other
						users. This includes but is not limited to:
					</p>
					<ul className='list-disc pl-6'>
						<li>Misuse of our services</li>
						<li>Posting inappropriate content</li>
						<li>Attempting to breach security measures</li>
					</ul>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>4. Termination</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						We reserve the right to suspend or terminate your account if you
						violate these terms or engage in any activity deemed harmful to the
						platform.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>5. Modifications to the Terms</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						Rangers United reserves the right to change these terms at any time.
						You are responsible for reviewing the terms periodically to stay
						informed of any updates.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>6. Disclaimer of Warranties</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						Rangers United is provided &quot;as is&quot; without any warranties,
						express or implied. We do not guarantee that the service will be
						uninterrupted, error-free, or free of harmful components.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>7. Limitation of Liability</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						In no event shall Rangers United or its affiliates be liable for any
						damages, including without limitation, direct, indirect, incidental,
						punitive, or consequential damages arising out of your use of the
						service.
					</p>
				</CardContent>
			</Card>

			<Card className='mb-8'>
				<CardHeader>
					<CardTitle>8. Governing Law</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						These terms are governed by and construed in accordance with the
						laws of [Your Country/State], and you submit to the exclusive
						jurisdiction of the courts in that jurisdiction.
					</p>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Contact Us</CardTitle>
				</CardHeader>
				<CardContent>
					<p>
						If you have any questions regarding these Terms of Service, please
						contact us at{' '}
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
		</div>
	);
}
