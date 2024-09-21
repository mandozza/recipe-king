'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useUserContext } from '@/contexts/UserContext';

// Define the new interface for the favorites prop
interface IFavorite {
	recipeId: string;
}

interface LogoProps {
	favorites: IFavorite[] | null;
}

const Logo: React.FC<LogoProps> = ({ favorites }) => {
	const { favoriteRecipes, setFavoriteRecipesCtx } = useUserContext();

	// loading up the favorite recipes context from the DB results
	useEffect(() => {
		if (favorites && favorites.length > 0) {
			if (JSON.stringify(favorites) !== JSON.stringify(favoriteRecipes)) {
				setFavoriteRecipesCtx(favorites);
			}
		}
	}, []); // purposely didn't include any dependencies to run only once.

	return (
		<h3 className="grow">
			<Link href="/">Recipe King11</Link>
		</h3>
	);
};
export default Logo;
