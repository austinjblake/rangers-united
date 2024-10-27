'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

export default function SignUpPage() {
	const { theme } = useTheme();

	return (
		<SignUp
			fallbackRedirectUrl='/dashboard'
			appearance={{ baseTheme: theme === 'dark' ? dark : undefined }}
		/>
	);
}
