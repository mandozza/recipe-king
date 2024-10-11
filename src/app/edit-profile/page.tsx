import { getSession } from '@/lib/session';
import { getProfile } from '@/data/users';
import { redirect } from 'next/navigation';
import { IAuthUser } from '@/types/user';
import ChangeEmail from '@/components/blocks/ChangeEmail';
import ChangePassword from '@/components/blocks/ChangePassword';
import ChangeProfile from '@/components/blocks/ChangeProfile';
import ChangeAvatar from '@/components/blocks/ChangeAvatar';

const EditProfilePage = async () => {
	const session = await getSession();
	const user = session?.user || null;

	// Redirect to login if user is not found
	if (!user || !user.id) {
		redirect('/login');
		return null;
	}

	//get user details
	const userDetails: IAuthUser | null = await getProfile({ id: user.id });

	// Handle the case where userDetails is null
	if (!userDetails) {
		// You can redirect to an error page or show an error message
		redirect('/error');
		return null;
	}

	return (
		<div className="mx-auto max-w-screen-md grid grid-cols-2 gap-8">
			<ChangeProfile user={userDetails} />
			<ChangeAvatar user={userDetails} />
			{userDetails.provider === 'email' && (
				<>
					<ChangeEmail user={userDetails} />
					<ChangePassword user={userDetails} />
				</>
			)}
		</div>
	);
};
export default EditProfilePage;
