import { NextResponse } from 'next/server';
import connectDB from '@/lib/db'; // Function to connect to MongoDB
import { Favorite } from '@/models/Favorite';
import { getSession } from '@/lib/session';
import { User as AuthUser } from '@auth/core/types';

// Helper function to add a favorite
async function addFavorite(userId: string, recipeId: string) {
	const existingFavorite = await Favorite.findOne({ userId, recipeId });
	if (existingFavorite) {
		return { message: 'Already a favorite', status: 200 };
	}
	const newFavorite = new Favorite({ userId, recipeId });
	await newFavorite.save();
	return { message: 'Recipe added to favorites', status: 201 };
}

// Helper function to remove a favorite
async function removeFavorite(userId: string, recipeId: string) {
	const favoriteToRemove = await Favorite.findOneAndDelete({
		userId,
		recipeId,
	});
	if (!favoriteToRemove) {
		return { message: 'Favorite not found', status: 404 };
	}
	return { message: 'Recipe removed from favorites', status: 200 };
}

export async function POST(req: Request) {
	// get user session
	const session = await getSession();
	const user: AuthUser | null = session?.user || null;
	const userId = user?.id;
	console.log('&&&&& HITING FAVORITE API &&&&&');

	// Ensure user is authenticated
	if (!userId) {
		return NextResponse.json(
			{ message: 'User is not authenticated.' },
			{ status: 401 }
		);
	}

	if (req.method === 'POST') {
		try {
			await connectDB();
			const body = await req.json();
			console.log('&&&&& request BODY &&&&&', body);
			const { recipeId, action } = body;

			// Check if all fields are provided
			if (!user?.id || !recipeId || !action) {
				return NextResponse.json(
					{ message: 'All fields are required.' },
					{ status: 400 }
				);
			}

			// Ensure recipeId and action are strings
			if (typeof recipeId !== 'string' || typeof action !== 'string') {
				return NextResponse.json(
					{ message: 'Invalid data types provided.' },
					{ status: 400 }
				);
			}

			// Check if the action is valid
			let result;
			if (action === 'add') {
				result = await addFavorite(userId, recipeId);
			} else if (action === 'remove') {
				result = await removeFavorite(userId, recipeId);
			} else {
				return NextResponse.json(
					{ message: 'Invalid action provided' },
					{ status: 400 }
				);
			}
			// Return the result
			return NextResponse.json(
				{ message: result.message },
				{ status: result.status }
			);
		} catch (error) {
			return NextResponse.json(
				{ message: 'Server error', error },
				{ status: 500 }
			);
		}
	}
}
