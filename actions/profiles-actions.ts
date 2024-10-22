'use server';

import {
	createProfile,
	deleteProfile,
	updateProfileDetails,
} from '@/db/queries/profiles-queries';
import { InsertProfile } from '@/db/schema/profiles-schema';
import { ActionState } from '@/types';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth-utils';

export async function createProfileAction(
	data: InsertProfile
): Promise<ActionState> {
	try {
		const newProfile = await createProfile(data);
		revalidatePath('/profile');
		return {
			status: 'success',
			message: 'Profile created successfully',
			data: newProfile,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to create profile' };
	}
}

export async function updateProfileAction(
	userId: string,
	data: Partial<InsertProfile>
): Promise<ActionState> {
	try {
		const updatedProfile = await updateProfileDetails(userId, data);
		return {
			status: 'success',
			message: 'Profile updated successfully',
			data: updatedProfile,
		};
	} catch (error) {
		return { status: 'error', message: 'Failed to update profile' };
	}
}

export async function deleteProfileAction(
	userId: string
): Promise<ActionState> {
	try {
		await deleteProfile(userId);
		revalidatePath('/profile');
		return { status: 'success', message: 'Profile deleted successfully' };
	} catch (error) {
		console.error('delete profile actions error:', error);
		return { status: 'error', message: 'Failed to delete profile' };
	}
}

export async function getUserIdAction() {
	const user = await requireAuth();
	return user;
}
