import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createProfileAction } from '@/actions/profiles-actions';

export async function POST(req: Request) {
	const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

	if (!WEBHOOK_SECRET) {
		throw new Error(
			'Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local'
		);
	}

	// Get the headers
	const headerPayload = headers();
	const svix_id = headerPayload.get('svix-id');
	const svix_timestamp = headerPayload.get('svix-timestamp');
	const svix_signature = headerPayload.get('svix-signature');

	// If there are no headers, error out
	if (!svix_id || !svix_timestamp || !svix_signature) {
		return new Response('Error occured -- no svix headers', {
			status: 400,
		});
	}

	// Get the body
	const payload = await req.json();
	const body = JSON.stringify(payload);

	// Create a new Svix instance with your secret.
	const wh = new Webhook(WEBHOOK_SECRET);

	let evt: WebhookEvent;

	// Verify the payload with the headers
	try {
		evt = wh.verify(body, {
			'svix-id': svix_id,
			'svix-timestamp': svix_timestamp,
			'svix-signature': svix_signature,
		}) as WebhookEvent;
	} catch (err) {
		console.error('Error verifying webhook:', err);
		return new Response('Error occured', {
			status: 400,
		});
	}

	// Handle the webhook
	const eventType = evt.type;
	if (eventType === 'user.created') {
		const { id, email_addresses, username, ...attributes } = evt.data;

		try {
			const result = await createProfileAction({
				userId: id,
				email: email_addresses[0].email_address,
				username: username || '',
			});

			if (result.status === 'error') {
				throw new Error(result.message);
			}

			return new Response('Profile created successfully', { status: 200 });
		} catch (error) {
			console.error('Error creating profile:', error);
			return new Response('Error creating profile', { status: 500 });
		}
	}

	return new Response('Webhook received', { status: 200 });
}

// Define the structure of the webhook event
interface WebhookEvent {
	data: {
		id: string;
		email_addresses: { email_address: string }[];
		username?: string;
		[key: string]: any;
	};
	object: string;
	type: string;
}
