import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';

interface Message {
	id: string;
	message: string;
	created_at: string;
	sender_id: string;
	is_deleted: boolean;
	edited_at: string | null;
	profiles: { username: string }[];
}

interface Notification {
	id: string;
	message: string;
	created_at: string;
}

const useChat = (validGameId: string) => {
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const fetchProfile = useCallback((userId: string) => {
		return supabase
			.from('profiles')
			.select('username')
			.eq('user_id', userId)
			.single();
	}, []);

	const fetchMessages = useCallback((validGameId: string) => {
		return supabase
			.from('messages')
			.select(
				'id, message, created_at, sender_id, is_deleted, edited_at, is_from_ex_member, profiles (username)'
			)
			.eq('game_id', validGameId)
			.eq('is_deleted', false)
			.eq('is_from_ex_member', false)
			.order('created_at', { ascending: true });
	}, []);

	const fetchNotifications = useCallback((validGameId: string) => {
		return supabase
			.from('game_notifications')
			.select('id, message, created_at')
			.eq('game_id', validGameId)
			.order('created_at', { ascending: false });
	}, []);

	const handleNewMessage = useCallback(
		async (payload: any) => {
			if (payload.new.is_deleted || payload.new.is_from_ex_member) return;
			const { data: profileData } = await fetchProfile(payload.new.sender_id);
			const messageWithUsername = {
				...payload.new,
				profiles: { username: profileData?.username || '' },
			};
			setMessages((currentMessages) => [
				...currentMessages,
				messageWithUsername,
			]);
		},
		[fetchProfile]
	);

	const handleUpdatedMessage = useCallback(
		async (payload: any) => {
			if (payload.new.is_deleted || payload.new.is_from_ex_member) {
				setMessages((currentMessages) =>
					currentMessages.filter((message) => message.id !== payload.new.id)
				);
				return;
			}
			const { data: profileData } = await fetchProfile(payload.new.sender_id);
			const updatedMessageWithUsername = {
				...payload.new,
				profiles: { username: profileData?.username || '' },
			};
			setMessages((currentMessages) =>
				currentMessages.map((message) =>
					message.id === payload.new.id ? updatedMessageWithUsername : message
				)
			);
		},
		[fetchProfile]
	);

	const handleNewNotification = useCallback((payload: any) => {
		setNotifications((currentNotifications) => [
			payload.new as Notification,
			...currentNotifications,
		]);
	}, []);

	const setupChannel = useCallback(
		(channel: any, gameId: string) => {
			console.log(`Setting up channel for game ID: ${gameId}`);
			const subscription = channel
				.on('presence', { event: 'sync' }, () =>
					console.log('Channel presence synced')
				)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'messages',
						filter: `game_id=eq.${gameId}`,
					},
					(payload: any) => {
						console.log('New message received:', payload);
						handleNewMessage(payload);
					}
				)
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'messages',
						filter: `game_id=eq.${gameId}`,
					},
					(payload: any) => {
						console.log('Message updated:', payload);
						handleUpdatedMessage(payload);
					}
				)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'game_notifications',
						filter: `game_id=eq.${gameId}`,
					},
					(payload: any) => {
						console.log('New notification received:', payload);
						handleNewNotification(payload);
					}
				)
				.on('error', (error: any) => console.log('Realtime error:', error))
				.subscribe();

			return () => {
				console.log(`Cleaning up channel for game ID: ${gameId}`);
				subscription.unsubscribe();
			};
		},
		[handleNewMessage, handleUpdatedMessage, handleNewNotification]
	);

	const setupSupabaseRealtime = useCallback(
		async (gameId: string) => {
			console.log(`Setting up Supabase realtime for game ID: ${gameId}`);
			setLoadingMessages(true);
			try {
				const [messagesResult, notificationsResult] = await Promise.all([
					fetchMessages(gameId),
					fetchNotifications(gameId),
				]);

				if (messagesResult.error) throw messagesResult.error;
				if (notificationsResult.error) throw notificationsResult.error;

				setMessages(messagesResult.data);
				setNotifications(notificationsResult.data);
			} catch (error) {
				console.error('Error fetching data:', error);
				setMessages([]);
				setNotifications([]);
			} finally {
				setLoadingMessages(false);
			}

			const channel = supabase.channel(`public:game_${gameId}`);
			return setupChannel(channel, gameId);
		},
		[fetchMessages, fetchNotifications, setupChannel]
	);

	useEffect(() => {
		let cleanup: (() => void) | undefined;

		if (validGameId) {
			setupSupabaseRealtime(validGameId).then((cleanupFn) => {
				cleanup = cleanupFn;
			});
		}

		return () => {
			console.log(`Cleaning up Supabase realtime for game ID: ${validGameId}`);
			cleanup?.();
		};
	}, [validGameId, setupSupabaseRealtime]);

	return { loadingMessages, messages, notifications };
};

export default useChat;
