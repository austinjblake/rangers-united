'use server';

import { db } from '@/db/db';
import { eq } from 'drizzle-orm';
import {
	InsertProfile,
	profilesTable,
	SelectProfile,
} from '../schema/profiles-schema';
import { deleteGame, getAllHostedGames } from './games-queries';
import { deleteGameSlot } from './slots-queries';
import { getGameSlotsByUser } from './slots-queries';
import { fetchAllLocationsForUser, removeLocation } from './locations-queries';
import { deleteAllNotificationsForUser } from './userNotifications-queries';
import { createGameNotificationAction } from '@/actions/gameNotifications-actions';
import { v4 as uuidv4 } from 'uuid';
import { deleteAllMessagesForUser } from './messages-queries';
import { deleteNotificationsForGameAction } from '@/actions/userNotifications-actions';

export const createProfile = async (profileData: InsertProfile) => {
	try {
		const [newProfile] = await db
			.insert(profilesTable)
			.values(profileData)
			.returning();
		return newProfile;
	} catch (error) {
		console.error('Error creating profile:', error);
		throw new Error('Failed to create profile');
	}
};

export const getProfileByUserId = async (userId: string) => {
	try {
		const profile = await db.query.profiles.findFirst({
			where: eq(profilesTable.userId, userId),
		});
		return profile;
	} catch (error) {
		console.error('Error getting profile by user ID:', error);
		throw new Error('Failed to get profile');
	}
};

export const getProfileByEmail = async (email: string) => {
	try {
		const profile = await db.query.profiles.findFirst({
			where: eq(profilesTable.email, email),
		});
		return profile;
	} catch (error) {
		console.error('Error getting profile by email:', error);
		throw new Error('Failed to get profile by email');
	}
};

export const updateProfileMembership = async (
	userId: string,
	newMembership: 'free' | 'pro'
) => {
	try {
		const [updatedProfile] = await db
			.update(profilesTable)
			.set({ membership: newMembership })
			.where(eq(profilesTable.userId, userId))
			.returning();
		return updatedProfile;
	} catch (error) {
		console.error('Error updating profile membership:', error);
		throw new Error('Failed to update profile membership');
	}
};

export const updateProfileDetails = async (
	userId: string,
	updatedData: Partial<InsertProfile>
) => {
	try {
		const [updatedProfile] = await db
			.update(profilesTable)
			.set(updatedData)
			.where(eq(profilesTable.userId, userId))
			.returning();
		return updatedProfile;
	} catch (error) {
		console.error('Error updating profile details:', error);
		throw new Error('Failed to update profile details');
	}
};

export const deleteProfile = async (userId: string) => {
	try {
		// delete all hosted games
		const hostedGames = await getAllHostedGames(userId);
		for (const game of hostedGames) {
			await deleteNotificationsForGameAction(game.id, userId);
			await deleteGame(game.id);
		}
		// delete all game slots
		const gameSlots = await getGameSlotsByUser(userId);
		const userProfile = await getProfileByUserId(userId);
		const username = userProfile?.username;
		for (const slot of gameSlots) {
			await deleteGameSlot(userId, slot.gameId as string);
			await createGameNotificationAction({
				id: uuidv4(),
				gameId: slot.gameId as string,
				notification: `${username} left the game`,
				createdAt: new Date(),
			});
		}
		// delete all locations
		const locations = await fetchAllLocationsForUser(userId);
		for (const location of locations) {
			console.log('deleting location:', location.id);
			await removeLocation(location.id);
		}
		// delete all user notifications
		await deleteAllNotificationsForUser(userId);
		// delete all messages
		await deleteAllMessagesForUser(userId);
		await db.delete(profilesTable).where(eq(profilesTable.userId, userId));
	} catch (error) {
		console.error('Error deleting profile:', error);
		throw new Error('Failed to delete profile');
	}
};

export const getAllProfiles = async (): Promise<SelectProfile[]> => {
	try {
		return await db.query.profiles.findMany();
	} catch (error) {
		console.error('Error getting all profiles:', error);
		throw new Error('Failed to get all profiles');
	}
};

export const updateProfileByStripeCustomerId = async (
	stripeCustomerId: string,
	data: Partial<InsertProfile>
) => {
	try {
		const [updatedProfile] = await db
			.update(profilesTable)
			.set(data)
			.where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
			.returning();
		return updatedProfile;
	} catch (error) {
		console.error('Error updating profile by stripe customer ID:', error);
		throw new Error('Failed to update profile');
	}
};
