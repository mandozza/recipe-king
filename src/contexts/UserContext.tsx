'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

// Auth User interface
interface AuthUser {
	firstName: string;
	lastName: string;
	name: string;
	email: string;
	image: string; // URL to the user's profile image
	id: string;
	role: string; // e.g., 'user', 'admin', etc.
	provider: string; // e.g., 'google', 'github', etc.
}
// Interface for a favoite recipe
interface IFavorite {
	recipeId: string;
}

// Define the shape of the context data
interface UserContextType {
	authUser: AuthUser;
	favoriteRecipes: IFavorite[]; // Array of recipe IDs
	setFavoriteRecipesCtx: (favorites: IFavorite[]) => void;
	setAuthUserCtx: (user: AuthUser) => void;
}

// Create the context with a default value of `null` or a valid object
const UserContext = createContext<UserContextType | null>(null);

// Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
	const [authUser, setAuthUser] = useState({
		firstName: '',
		lastName: '',
		name: '',
		email: '',
		image: '',
		id: '',
		role: '',
		provider: '',
	}); // Auth User interface

	const [favoriteRecipes, setFavoriteRecipes] = useState<IFavorite[]>([]);

	const setFavoriteRecipesCtx = (favorites: IFavorite[]) => {
		console.log('^^^^^^^^^', favorites);
		setFavoriteRecipes(favorites);
	};

	const setAuthUserCtx = (user: AuthUser) => {
		setAuthUser(user);
	};

	return (
		<UserContext.Provider
			value={{
				authUser,
				favoriteRecipes,
				setAuthUserCtx,
				setFavoriteRecipesCtx,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

// Custom hook to use the context
export function useUserContext() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useMyContext must be used within a UserProvider');
	}
	return context;
}
