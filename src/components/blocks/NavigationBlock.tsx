import Link from 'next/link';
import ThemeToggleBlock from '@/components/blocks/ThemeToggleBlock';
import UserNavBlock from '@/components/blocks/UserNavBlock';
import Logo from '@/components/blocks/bricks/Logo';
import { getFavorites } from '@/data/favorites';
import { Button } from '@/components/ui/button';
import { getSession } from '@/lib/session';
import { User as AuthUser } from '@auth/core/types';

interface IFavorite {
	recipeId: string;
}

const NavigationBlock = async () => {
	const session = await getSession();
	const user: AuthUser | null = session?.user || null;
	let favorites: IFavorite[] = [];

	if (user && user.id) {
		favorites = (await getFavorites(user.id)) as IFavorite[];
	}

	return (
		<nav className="flex justify-between">
			<Logo favorites={favorites} />
			<div className="flex items-center space-x-4">
				<ThemeToggleBlock />
				{!user ? (
					<Button variant="default" asChild>
						<Link href="/login">Sign In / Register</Link>
					</Button>
				) : (
					<>
						<UserNavBlock user={user} />
					</>
				)}
			</div>
		</nav>
	);
};
export default NavigationBlock;
