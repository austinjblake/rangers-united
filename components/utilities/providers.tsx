'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			{...props}
		>
			<TooltipProvider>{children}</TooltipProvider>
		</NextThemesProvider>
	);
};
