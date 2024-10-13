import Link from 'next/link';
import { signOut } from '~/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPen, LogOut, CircleUserRound } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { User as AuthUser } from '@auth/core/types';
import UserNavFavorites from '@/components/blocks/bricks/UserNavFavorites';

interface UserNavBlockProps {
	user: AuthUser;
}

const UserNavBlock: React.FC<UserNavBlockProps> = ({ user }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image ?? undefined} />
					<AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className="flex">
					<CircleUserRound className="mt-1 mx-2" size={14} />
					{user.name}
				</DropdownMenuLabel>
				<DropdownMenuItem>
					<Link href="/edit-profile" className="flex">
						<UserPen className="mt-1 mx-2" size={14} />
						Edit Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link href="/dashboard/add-recipe" className="flex">
						<UserPen className="mt-1 mx-2" size={14} />
						Add Recipe
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<UserNavFavorites />
				</DropdownMenuItem>
				<DropdownMenuItem>
					<form
						action={async () => {
							'use server';
							await signOut();
						}}
					>
						<button type="submit" className="flex">
							<LogOut className="mt-1 mx-2" size={14} />
							Sign Out
						</button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default UserNavBlock;
