'use client';

import { useState, useEffect } from 'react';
import { useUserContext } from '@/contexts/UserContext';
import { Heart } from 'lucide-react';

// Define the interface for the props
interface FavoriteBtnProps {
	_id: string;
}

const FavoriteBtn: React.FC<FavoriteBtnProps> = ({ _id }) => {
	// get the favorite recipes from the context
	const { favoriteRecipes, setFavoriteRecipesCtx } = useUserContext();
	// set up state
	const [isFavorited, setIsFavorited] = useState(false);
	// Use useEffect to set the initial state based on the favorites
	useEffect(() => {
		const isFavorite = favoriteRecipes.some(
			(recipe) => recipe.recipeId === _id
		);
		setIsFavorited(isFavorite); // Only set state here once after checking
	}, [favoriteRecipes, _id]); // Re-run this effect only when favoriteRecipes or _id changes

	const handleHeartClicked = async () => {
		// Toggle the heart color state
		const newIsFavorited = !isFavorited;
		setIsFavorited(newIsFavorited);
		console.log('##newIsFavorited:', newIsFavorited);
		// update the context
		if (newIsFavorited) {
			setFavoriteRecipesCtx([...favoriteRecipes, { recipeId: _id }]);
		} else {
			setFavoriteRecipesCtx(
				favoriteRecipes.filter((recipe) => recipe.recipeId !== _id)
			);
		}

		// update dB
		try {
			const response = await fetch('/api/favorite', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					recipeId: _id,
					action: newIsFavorited ? 'add' : 'remove',
				}),
			});

			if (response.ok) {
				console.log('Recipe added to favorites');
			} else {
				console.error('Failed to add recipe to favorites');
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<div>
			<Heart
				className={`mt-3 mr-3 cursor-pointer ${
					isFavorited ? 'text-red-500' : ''
				}`}
				onClick={handleHeartClicked}
			/>
		</div>
	);
};

export default FavoriteBtn;
