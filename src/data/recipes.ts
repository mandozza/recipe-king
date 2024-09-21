import connectDB from '@/lib/db';
import { Recipe } from '@/models/Recipe';

export const getRecipes = async () => {
	try {
		// Establish the database connection
		await connectDB();
		// Fetch the latest 12 recipes, sorted by creation date (assuming you have a createdAt field)
		const latestRecipes = await Recipe.find()
			.limit(12)
			.sort({ createdAt: -1 })
			.lean();
		return latestRecipes;
	} catch (error) {
		console.log('Error:', error);
		return [];
	}
};
