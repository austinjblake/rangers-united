'use server';

import { revalidatePath } from 'next/cache';
import {
	getSavedSearchesByUserId,
	createSavedSearch,
	deleteSavedSearch,
} from '@/db/queries/savedSearch-queries';
import { InsertSavedSearch } from '@/db/schema/savedSearch-schema';
import { ActionState } from '@/types';
import { requireAuth } from '@/lib/auth-utils';

export async function getSavedSearchesByUserIdAction(): Promise<ActionState> {
	try {
		const userId = await requireAuth();
		const data = await getSavedSearchesByUserId(userId);
		return {
			status: 'success',
			message: 'Saved searches retrieved successfully',
			data,
		};
	} catch (error) {
		console.error('Failed to get saved searches:', error);
		return {
			status: 'error',
			message: 'Failed to get saved searches',
		};
	}
}

export async function createSavedSearchAction(
	data: InsertSavedSearch
): Promise<ActionState> {
	try {
		const savedSearch = await createSavedSearch(data);
		revalidatePath('/dashboard');
		return {
			status: 'success',
			message: 'Saved search created successfully',
			data: savedSearch,
		};
	} catch (error) {
		console.error('Failed to create saved search:', error);
		return {
			status: 'error',
			message: 'Failed to create saved search',
		};
	}
}

export async function deleteSavedSearchAction(
	id: string
): Promise<ActionState> {
	try {
		await deleteSavedSearch(id);
		revalidatePath('/dashboard');
		return {
			status: 'success',
			message: 'Saved search deleted successfully',
		};
	} catch (error) {
		console.error('Failed to delete saved search:', error);
		return {
			status: 'error',
			message: 'Failed to delete saved search',
		};
	}
}
