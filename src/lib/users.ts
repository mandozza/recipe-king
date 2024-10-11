/**
 * Checks if the username has changed and verifies if the new username is already in use.
 *
 * @param user - The authenticated user object.
 * @param userName - The new username to check.
 * @returns A promise that resolves to a boolean indicating whether the username change is valid.
 *
 * @remarks
 * - If the username has changed, the function connects to the database and checks if the new username is already taken.
 * - If the new username is already in use, the function logs an error and returns `false`.
 * - If the username has not changed or the new username is not in use, the function returns `true`.
 */
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { User as AuthUser } from '@auth/core/types';

export const checkUserNameChange = async (
	user: AuthUser,
	userName: string
): Promise<boolean> => {
	const userNameChange = user.name !== userName;

	if (userNameChange) {
		await connectDB();
		const existingUserName = await User.findOne({
			userName: userName,
		})
			.lean()
			.exec();
		if (existingUserName) {
			console.error('Username already in use');
			return false;
		}
	}

	return true;
};
