'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import {
	FacebookShareButton,
	TwitterShareButton,
	RedditShareButton,
	WhatsappShareButton,
	FacebookIcon,
	TwitterIcon,
	RedditIcon,
	WhatsappIcon,
} from 'next-share';
import { Link } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ExpandableShareButtonProps {
	url: string;
	title: string;
}

export function ExpandableShareButton({
	url,
	title,
}: ExpandableShareButtonProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsExpanded(false);
			}
		};

		if (isExpanded) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isExpanded]);

	const copyToClipboard = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(url);
		toast({
			title: 'Link copied to clipboard',
			duration: 2000,
		});
	};

	return (
		<div ref={containerRef} className='relative'>
			<Button
				onClick={() => setIsExpanded(!isExpanded)}
				className='hover:bg-primary/20 hover:text-primary'
				variant='outline'
				size='icon'
				title='Share Game'
			>
				<Share2 size={24} />
			</Button>
			<div
				className={`absolute top-full left-0 mt-2 flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-md shadow-lg z-50 transition-all duration-300 ${
					isExpanded
						? 'opacity-100 scale-100'
						: 'opacity-0 scale-95 pointer-events-none'
				}`}
			>
				<FacebookShareButton
					url={url}
					quote={title}
					title={title}
					className='flex items-center justify-center hover:opacity-80 transition-opacity'
				>
					<div title='Share on Facebook' className='w-8 h-8'>
						<FacebookIcon size={32} round />
					</div>
				</FacebookShareButton>

				<TwitterShareButton
					url={url}
					title={title}
					className='flex items-center justify-center hover:opacity-80 transition-opacity'
				>
					<div title='Share on X (Twitter)' className='w-8 h-8'>
						<TwitterIcon size={32} round />
					</div>
				</TwitterShareButton>

				<RedditShareButton
					url={url}
					title={title}
					className='flex items-center justify-center hover:opacity-80 transition-opacity'
				>
					<div title='Share on Reddit' className='w-8 h-8'>
						<RedditIcon size={32} round />
					</div>
				</RedditShareButton>

				<WhatsappShareButton
					url={url}
					title={title}
					separator=':: '
					className='flex items-center justify-center hover:opacity-80 transition-opacity'
				>
					<div title='Share on Whatsapp' className='w-8 h-8'>
						<WhatsappIcon size={32} round />
					</div>
				</WhatsappShareButton>

				<a
					href={`https://discord.com/channels/@me?content=${encodeURIComponent(
						title + ' ' + url
					)}`}
					target='_blank'
					rel='noopener noreferrer'
					className='h-8 w-8 p-0 flex items-center justify-center hover:opacity-80 transition-opacity'
					title='Share on Discord'
				>
					<DiscordIcon size={32} />
				</a>

				<Button
					onClick={copyToClipboard}
					variant='outline'
					size='icon'
					className='h-8 w-8 p-0 flex items-center justify-center hover:opacity-80 transition-opacity'
					title='Copy Link'
				>
					<Link size={24} />
				</Button>
			</div>
		</div>
	);
}

const DiscordIcon = ({ size = 32 }) => (
	<svg
		width={size}
		height={size}
		viewBox='0 0 24 24'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			d='M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z'
			fill='currentColor'
		/>
	</svg>
);
