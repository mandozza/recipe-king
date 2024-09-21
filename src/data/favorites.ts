'use server';

import connectDB from '@/lib/db';
import { Favorite } from '@/models/Favorite';

export const getFavorites = async (
	userId: string
): Promise<{ recipeId: string }[]> => {
	console.log('@@@@@ getFavorite Called on DB @@@@@@@');
	try {
		// Establish the database connection
		await connectDB();
		const userFavorites = await Favorite.find({ userId }).lean().exec();
		// User not found
		if (!userFavorites) {
			console.log('no favorites found');
			return [];
		} else {
			// Return an array of favorites that only contain the recipeId
			const favorites = userFavorites.map((favorite) => ({
				recipeId: favorite.recipeId.toString(), // Ensure recipeId is a string
			}));
			return favorites;
		}
	} catch (error) {
		console.error('Error during authorization:', error);
		return [];
	}
};
