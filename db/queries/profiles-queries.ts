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
import { fetchLocationsByUserId } from './locations-queries';
import { deleteLocation } from '@/actions/locations-actions';
import { deleteAllNotificationsForUser } from './userNotifications-queries';
import { createNotificationAction } from '@/actions/gameNotifications-actions';
import { v4 as uuidv4 } from 'uuid';
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
		console.log('deleting hosted games:', userId);
		const hostedGames = await getAllHostedGames(userId);
		for (const game of hostedGames) {
			await deleteGame(game.id);
		}
		// delete all game slots
		console.log('deleting game slots:', userId);
		const gameSlots = await getGameSlotsByUser(userId);
		const userProfile = await getProfileByUserId(userId);
		const username = userProfile?.username;
		for (const slot of gameSlots) {
			await createNotificationAction({
				id: uuidv4(),
				gameId: slot.gameId as string,
				notification: `${username} left the game`,
				createdAt: new Date(),
			});
			await deleteGameSlot(slot.slotId, slot.gameId as string);
		}
		// delete all locations
		console.log('deleting locations:', userId);
		const locations = await fetchLocationsByUserId(userId);
		for (const location of locations) {
			await deleteLocation(location.id);
		}
		// delete all user notifications
		console.log('deleting user notifications:', userId);
		await deleteAllNotificationsForUser(userId);
		console.log('deleting profile:', userId);
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
