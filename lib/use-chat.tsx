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

	const fetchMessages = (validGameId: string) => {
		return supabase
			.from('messages')
			.select(
				'id, message, created_at, sender_id, is_deleted, edited_at, profiles (username)'
			)
			.eq('game_id', validGameId)
			.eq('is_deleted', false)
			.order('created_at', { ascending: true });
	};

	const fetchNotifications = (validGameId: string) => {
		return supabase
			.from('game_notifications')
			.select('id, message, created_at')
			.eq('game_id', validGameId)
			.order('created_at', { ascending: false });
	};

	const handleNewMessage = useCallback(async (payload: any) => {
		if (payload.new.is_deleted) return;
		const { data: profileData } = await fetchProfile(payload.new.sender_id);
		const messageWithUsername = {
			...payload.new,
			profiles: { username: profileData?.username || '' },
		};
		setMessages((currentMessages) => [...currentMessages, messageWithUsername]);
	}, []);

	const handleUpdatedMessage = useCallback(async (payload: any) => {
		if (payload.new.is_deleted) {
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
	}, []);

	const handleNewNotification = useCallback((payload: any) => {
		setNotifications((currentNotifications) => [
			payload.new as Notification,
			...currentNotifications,
		]);
	}, []);

	const fetchProfile = (userId: string) => {
		return supabase
			.from('profiles')
			.select('username')
			.eq('user_id', userId)
			.single();
	};

	const setupChannel = useCallback(
		(channel: any, gameId: string) => {
			channel
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
					handleNewMessage
				)
				.on(
					'postgres_changes',
					{
						event: 'UPDATE',
						schema: 'public',
						table: 'messages',
						filter: `game_id=eq.${gameId}`,
					},
					handleUpdatedMessage
				)
				.on(
					'postgres_changes',
					{
						event: 'INSERT',
						schema: 'public',
						table: 'game_notifications',
						filter: `game_id=eq.${gameId}`,
					},
					handleNewNotification
				)
				.subscribe();
		},
		[handleNewMessage, handleUpdatedMessage, handleNewNotification]
	);
	const setupSupabaseRealtime = useCallback(
		async (gameId: string) => {
			const { data: messagesData, error: messagesError } = await fetchMessages(
				gameId
			);
			if (messagesError) {
				console.error('Error fetching messages:', messagesError);
				setMessages([]);
			} else {
				setMessages(messagesData);
			}
			const { data: notificationsData, error: notificationsError } =
				await fetchNotifications(gameId);
			if (notificationsError) {
				console.error('Error fetching notifications:', notificationsError);
				setNotifications([]);
			} else {
				setNotifications(notificationsData);
			}

			const channel = supabase.channel(`public:game_${gameId}`);
			setupChannel(channel, gameId);
		},
		[setupChannel]
	);

	useEffect(() => {
		if (validGameId) {
			setupSupabaseRealtime(validGameId);
			setLoadingMessages(false);
		}
	}, [validGameId, setupSupabaseRealtime]);

	return { loadingMessages, messages, notifications };
};

export default useChat;
