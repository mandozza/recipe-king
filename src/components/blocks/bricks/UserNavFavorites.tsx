'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';

const UserNavFavorites = () => {
	const { favoriteRecipes } = useUserContext();

	const Favorites = favoriteRecipes ? (
		<Link href="/favorites" className="flex">
			<Heart
				className={'mt-1 mx-2 cursor-pointer text-red-500 '}
				size={14}
			/>
			Favorites ({favoriteRecipes.length})
		</Link>
	) : (
		<Link href="/favorites">
			<Heart className={'mt-1 mx-2 cursor-pointer'} size={14} />
			Favorites
		</Link>
	);

	return Favorites;
};
export default UserNavFavorites;
