'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, TrashIcon, PencilIcon, ChevronDown, Crown } from 'lucide-react';
import {
	createMessageAction,
	deleteMessageAction,
	updateMessageAction,
} from '@/actions/messages-actions';
import { formatDistanceToNow, format, isAfter } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { useAuth } from '@clerk/nextjs';
import { toast } from '@/components/ui/use-toast';
import { generateColor } from '@/lib/username-color';

interface GameChatProps {
	gameId: string;
	isHost: boolean;
	hostId: string;
	messages: any[];
}

export function GameChat({ gameId, isHost, hostId, messages }: GameChatProps) {
	const [newMessage, setNewMessage] = useState('');
	const [showFullTime, setShowFullTime] = useState<{ [key: string]: boolean }>(
		{}
	);
	const { userId } = useAuth();
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [editedMessage, setEditedMessage] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);

	const smoothScrollToBottom = () => {
		// Easing function
		const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
			t /= d / 2;
			if (t < 1) return (c / 2) * t * t + b;
			t--;
			return (-c / 2) * (t * (t - 2) - 1) + b;
		};
		if (scrollAreaRef.current && lastMessageRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]'
			);
			if (scrollElement) {
				const targetScrollTop =
					scrollElement.scrollHeight - scrollElement.clientHeight;
				const startScrollTop = scrollElement.scrollTop;
				const distance = targetScrollTop - startScrollTop;
				let startTime: number | null = null;

				const animation = (currentTime: number) => {
					if (startTime === null) startTime = currentTime;
					const timeElapsed = currentTime - startTime;
					const run = easeInOutQuad(timeElapsed, startScrollTop, distance, 300);
					scrollElement.scrollTop = run;
					if (timeElapsed < 300) requestAnimationFrame(animation);
				};

				requestAnimationFrame(animation);
			}
		}
	};

	useEffect(() => {
		if (lastMessageRef.current && messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage.sender_id === userId) {
				smoothScrollToBottom();
			}
		}
	}, [messages, userId]);

	const handleSendMessage = async () => {
		if (newMessage.trim()) {
			const result = await createMessageAction(newMessage, gameId);
			if (result.status === 'success') {
				setNewMessage('');
				const newMessageId = result.data.newMessageId;
				const senderId = result.data.senderId;

				if (senderId === userId) {
					setTimeout(() => {
						messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
					}, 100);
				}
			}
		}
	};

	const handleDeleteMessage = async (id: string) => {
		const result = await deleteMessageAction(id, gameId);
		if (result.status === 'error') {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to delete message. Please try again.',
			});
		}
	};

	const handleEditMessage = async (id: string, currentMessage: string) => {
		setEditingMessageId(id);
		setEditedMessage(currentMessage);
	};

	const handleSaveEdit = async () => {
		if (editingMessageId && editedMessage.trim()) {
			const result = await updateMessageAction(editingMessageId, editedMessage);
			if (result.status === 'success') {
				setEditingMessageId(null);
				setEditedMessage('');
			}
		}
	};

	const handleCancelEdit = () => {
		setEditingMessageId(null);
		setEditedMessage('');
	};

	const formatMessageTime = (timestamp: string, isEdited: boolean = false) => {
		const date = new Date(`${timestamp}Z`);
		const formattedDate = formatInTimeZone(
			date,
			Intl.DateTimeFormat().resolvedOptions().timeZone,
			'MMM d, yyyy h:mm a'
		);
		const relativeTime = formatDistanceToNow(formattedDate, {
			addSuffix: true,
		});
		return isEdited ? `edited ${relativeTime}` : relativeTime;
	};

	const formatFullTime = (timestamp: string, isEdited: boolean = false) => {
		const date = new Date(`${timestamp}Z`);
		const formattedDate = formatInTimeZone(
			date,
			Intl.DateTimeFormat().resolvedOptions().timeZone,
			'MMM d, yyyy h:mm a'
		);
		return isEdited
			? `edited ${format(formattedDate, 'MMM d, yyyy h:mm a')}`
			: format(formattedDate, 'MMM d, yyyy h:mm a');
	};

	const toggleTimeDisplay = (messageId: string) => {
		setShowFullTime((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
	};

	const handleScroll = () => {
		if (scrollAreaRef.current) {
			const scrollElement = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]'
			);
			if (scrollElement) {
				const { scrollTop, scrollHeight, clientHeight } = scrollElement;
				const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 1;
				setShowScrollButton(!isScrolledToBottom);
			}
		}
	};

	useEffect(() => {
		const checkScrollButton = () => {
			if (scrollAreaRef.current) {
				const scrollElement = scrollAreaRef.current.querySelector(
					'[data-radix-scroll-area-viewport]'
				);
				if (scrollElement) {
					const { scrollTop, scrollHeight, clientHeight } = scrollElement;
					const isScrolledToBottom =
						scrollHeight - scrollTop - clientHeight < 1;
					setShowScrollButton(!isScrolledToBottom);
				}
			}
		};

		checkScrollButton();

		const scrollElement = scrollAreaRef.current?.querySelector(
			'[data-radix-scroll-area-viewport]'
		);
		if (scrollElement) {
			scrollElement.addEventListener('scroll', checkScrollButton);
			return () =>
				scrollElement.removeEventListener('scroll', checkScrollButton);
		}
	}, [messages]);

	return (
		<div className='p-4 relative'>
			<h2 className='text-lg font-semibold mb-2'>Chat</h2>
			<ScrollArea
				ref={scrollAreaRef}
				className='h-[400px] w-full rounded-md border p-2 overflow-y-auto'
				style={{ overscrollBehavior: 'contain' }}
			>
				{messages.map((message, index) => (
					<div
						key={message.id}
						className='mb-2 relative group bg-secondary p-2 rounded-md'
						ref={index === messages.length - 1 ? lastMessageRef : null}
					>
						<div className='flex justify-between items-start mb-0.5'>
							<p
								className={`font-semibold text-sm italic flex items-center`}
								style={{
									color:
										message.sender_id === hostId
											? '#EAB308'
											: generateColor(message.profiles.username),
								}}
							>
								{message.profiles.username}
								{message.sender_id === hostId && (
									<span className='ml-1' title='Game Host'>
										<Crown className='h-4 w-4 text-yellow-500' />
									</span>
								)}
							</p>
							{(isHost || message.sender_id === userId) && (
								<div className='opacity-0 group-hover:opacity-100 transition-opacity flex'>
									{message.sender_id === userId && (
										<button
											onClick={() =>
												handleEditMessage(message.id, message.message)
											}
											className='mr-2'
											title='Edit Message'
										>
											<PencilIcon className='h-3 w-3 text-primary' />
										</button>
									)}
									{(isHost || message.sender_id === userId) && (
										<button
											onClick={() => handleDeleteMessage(message.id)}
											title='Delete Message'
										>
											<TrashIcon className='h-3 w-3 text-destructive' />
										</button>
									)}
								</div>
							)}
						</div>
						{editingMessageId === message.id ? (
							<div className='flex mt-1'>
								<Input
									type='text'
									value={editedMessage}
									onChange={(e) => setEditedMessage(e.target.value)}
									className='flex-grow'
								/>
								<Button onClick={handleSaveEdit} className='ml-2'>
									Save
								</Button>
								<Button
									onClick={handleCancelEdit}
									className='ml-2'
									variant='outline'
								>
									Cancel
								</Button>
							</div>
						) : (
							<p className='text-foreground text-sm mb-0.5'>
								{message.message}
							</p>
						)}
						<small
							className='text-muted-foreground cursor-pointer text-xs'
							onClick={() => toggleTimeDisplay(message.id)}
						>
							{showFullTime[message.id]
								? formatFullTime(message.created_at)
								: formatMessageTime(message.created_at)}
							{message.edited_at &&
								isAfter(
									new Date(message.edited_at),
									new Date(message.created_at)
								) && (
									<span className='italic ml-1'>
										{' • '}
										{showFullTime[message.id]
											? formatFullTime(message.edited_at, true)
											: formatMessageTime(message.edited_at, true)}
									</span>
								)}
						</small>
					</div>
				))}
			</ScrollArea>
			{showScrollButton && (
				<Button
					className='absolute bottom-16 right-6 rounded-full p-2 bg-secondary hover:bg-secondary/90 transition-colors border border-primary'
					onClick={smoothScrollToBottom}
					size='icon'
					variant='ghost'
				>
					<ChevronDown className='h-5 w-5' />
				</Button>
			)}
			<div className='mt-2 flex'>
				<Input
					type='text'
					placeholder='Type a message...'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSendMessage();
							e.preventDefault();
						}
					}}
				/>
				<Button onClick={handleSendMessage} className='ml-2'>
					<Send className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}