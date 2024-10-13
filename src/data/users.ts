'use server';

import connectDB from '@/lib/db';
import { User, IUser } from '@/models/User';
import { IAuthUser } from '@/types/user';
import { redirect } from 'next/navigation';
import { saltAndHashPassword, comparePassword } from '@/lib/password';
import { getSession } from '@/lib/session';
import { checkUserNameChange } from '@/lib/users';
import { changePasswordSchema } from '@/lib/zod';
import { ZodError } from 'zod';

interface UserExistParams {
	email: string;
	provider?: string;
}

interface AddAuthUserParams {
	name: string;
	email: string;
	image: string;
	provider: string;
}

/**
 * Fetches a user from the database by email and password hash.
 *
 * @param {string} email - The email address of the user to look up.
 * @param {string} password - The password to match the user.
 * @returns {Promise<IUser | null>} A promise that resolves to the user object if found, or null if not.
 *
 * @example
 * const user = await authUserFromDb('user@example.com', 'Password123');
 * if (user) {
 *   console.log('User found:', user);
 * } else {
 *   console.log('User not found');
 *
 * @throws {Error} If there's an issue during the database connection or querying process.
 */
export const authUserFromDb = async (
	email: string,
	password: string
): Promise<IUser | null> => {
	try {
		// Establish the database connection
		await connectDB();
		const user = await User.findOne({ email }).lean().exec();
		// User not found
		if (!user) {
			console.log('User not found');
			return null;
		}
		//User found, check password
		const isPasswordCorrect = await comparePassword(
			password,
			user.password
		);

		if (!isPasswordCorrect) {
			console.log('Incorrect password');
			return null;
		}
		return user;
	} catch (error) {
		console.error('Error fetching user from DB:', error);
		return null;
	}
};

/**
 * Registers a new user in the database.
 *
 * @param {FormData} formData - The form data to use for user registration.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 *
 * @example
 * const formData = new FormData();
 * formData.set('firstName', 'John');
 * formData.set('lastName', 'Doe');
 * formData.set('email', '
 * formData.set('password', 'password123');
 * register(formData);
 *
 * @throws {Error} If the form data is missing any required fields.
 */
export const register = async (formData: FormData) => {
	const firstName = formData.get('firstName') as string;
	const lastName = formData.get('lastName') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!firstName || !lastName || !email || !password) {
		throw new Error('Please fill all fields');
	}

	await connectDB();

	// existing user
	const existingUser = await User.findOne({ email }).lean().exec();
	if (existingUser) throw new Error('User already exists');

	const hashedPassword = await saltAndHashPassword(password);

	await User.create({
		userName: `${firstName} ${lastName}`,
		firstName,
		lastName,
		email,
		password: hashedPassword,
		role: 'user',
		provider: 'email',
		accountVerified: false,
	});
	console.log(`User created successfully 🥂`);
	redirect('/login');
};

/**
 * Checks if a user exists in the database by email.
 *
 * @param {UserExistParams} params - The parameters for checking user existence.
 * @param {string} params.email - The email of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
 */
export const UserExist = async ({
	email,
	provider,
}: UserExistParams): Promise<boolean> => {
	await connectDB();
	try {
		const alreadyUser = await User.findOne({ email, provider });
		return !!alreadyUser; // converts to boolean
	} catch (error) {
		console.error('Error finding user:', error);
		return false;
	}
};

/**
 * Adds an authenticated user to the database.
 *
 * @param {AddAuthUserParams} params - The parameters for adding an authenticated user.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 * @param {string} params.image - The image URL of the user.
 * @param {string} params.provider - The provider of the user.
 */
export const addAuthUserToDB = async ({
	name,
	email,
	image,
	provider,
}: AddAuthUserParams) => {
	try {
		await connectDB();
		await User.create({
			userName: name,
			email,
			imageUri: image,
			role: 'user',
			provider: provider,
			accountVerified: true,
		});
	} catch (error) {
		console.log('Error creating user:', error);
	}
};

export const getAuthUserDetails = async (email) => {
	try {
		await connectDB();
		const user = await User.findOne({ email }).lean().exec();

		if (!user) return null;

		const userDetail = {
			id: user?._id.toString(),
			userName: user?.userName,
			role: user?.role,
			provider: user?.provider,
		};

		return userDetail;
	} catch (error) {
		console.error('Error fetching user from DB:', error);
		return null;
	}
};

/**
 * Edits the profile of the authenticated user.
 *
 * @param {Object} params - The parameters for editing the user profile.
 * @param {string} params.userName - The new username for the user.
 * @param {string} params.firstName - The new first name for the user.
 * @param {string} params.lastName - The new last name for the user.
 * @returns {Promise<void>} - A promise that resolves when the user profile is updated.
 *
 * @example
 * await editUserProfile({
 *   userName: 'newUsername',
 *   firstName: 'NewFirstName',
 *   lastName: 'NewLastName'
 * });
 *
 * @throws {Error} If the user is not authenticated, the username is already in use, or there is an error updating the user.
 */
export const editUserProfile = async ({
	userName,
	firstName,
	lastName,
}: {
	userName: string;
	firstName: string;
	lastName: string;
}) => {
	const session = await getSession();
	const user = session?.user || null;

	if (!user) {
		console.error('User not found');
		return;
	}
	await connectDB();

	console.log('###editUserProfile###', { userName, firstName, lastName });

	const checkChangingUsername = checkUserNameChange(user, userName);

	// if username or email change is not valid return
	if (!checkChangingUsername) {
		console.error('Username already in use');
		return;
	}

	// update user
	const updated = await User.updateOne(
		{ _id: user.id },
		{
			$set: {
				userName,
				firstName,
				lastName,
			},
		}
	);

	if (!updated) {
		console.error('Error updating user');
		return;
	}
	return updated;
};

/**
 * Updates a user's email after validating that the email is not already in use by another user
 * and that the provided user ID matches the current authenticated user's ID.
 *
 * @param {Object} params - The parameters for updating the user's email.
 * @param {string} params.id - The ID of the user requesting the email change.
 * @param {string} params.email - The new email to update for the user.
 * @returns {Promise<boolean>} - Returns `true` if the email was successfully updated, `false` otherwise.
 *
 * @throws Will log an error if the session is invalid, the user ID does not match, the email is invalid,
 *         the email is already in use, or if the update process fails.
 */
export const editUserEmail = async ({
	id,
	email,
}: {
	id: string;
	email: string;
}) => {
	let isUpdated = false;
	const session = await getSession();
	const user = session?.user || null;

	console.log('editUserEmail', user);

	if (!user) {
		console.error('User not found');
		return isUpdated;
	}

	// comfirm user and updated userid are same before updating
	if (user.id !== id) {
		console.error('User not found');
		return isUpdated;
	}

	// validate email
	if (!email || !email.includes('@')) {
		console.error('Invalid email');
		return isUpdated;
	}

	await connectDB();

	// check email is not currently in use by another user
	const isEmailTaken = await User.findOne({
		email: email,
		_id: { $ne: user.id }, // Exclude the current user by their _id
	}).lean();

	if (isEmailTaken) {
		console.error('Email is already in use by another user');
		return isUpdated;
	}

	const updated = await User.updateOne(
		{ _id: user.id },
		{
			$set: {
				email: email,
			},
		}
	);

	if (!updated) {
		console.error('Error updating user');
		return isUpdated;
	} else {
		isUpdated = true;
	}
	return isUpdated;
};

/**
 * Updates a user's password after validating the new password, ensuring the authenticated user's
 * ID matches the provided ID, and hashing the password before storing it in the database.
 *
 * @param {Object} params - The parameters for updating the user's password.
 * @param {string} params.id - The ID of the user requesting the password change.
 * @param {string} params.password - The new password to update for the user.
 * @returns {Promise<boolean>} - Returns `true` if the password was successfully updated, `false` otherwise.
 *
 * @throws Will log an error if password validation fails, the session is invalid, the user ID does not match,
 *         or if the update process fails.
 */
export const editUserPassword = async ({
	id,
	password,
}: {
	id: string;
	password: string;
}): Promise<boolean> => {
	let isUpdated = false;

	// Validate the password using signUpSchema
	try {
		changePasswordSchema.parse({ password });
	} catch (error) {
		if (error instanceof ZodError) {
			console.error('Password validation failed:', error.errors);
			return isUpdated;
		}
	}

	// get session
	const session = await getSession();
	const user = session?.user || null;

	// check user exists
	if (!user) {
		console.error('User not found');
		return isUpdated;
	}
	// comfirm user and updated userid are same before updating
	if (user.id !== id) {
		console.error('User not found');
		return isUpdated;
	}
	// hash the new password
	const hashedPassword = await saltAndHashPassword(password);

	// Update the user's password in the database
	await connectDB();
	await User.updateOne({ _id: id }, { $set: { password: hashedPassword } });
	isUpdated = true;

	return isUpdated;
};

/**
 * Fetches a user from the database by ID.
 *
 * @param {string} id - The ID of the user to look up.
 * @returns {Promise<IAuthUser | null>} A promise that resolves to the user object if found, or null if not.
 *
 * @example
 * const user = await getProfile('1234567890');
 * if (user) {
 *   console.log('User found:', user);
 * } else {
 *   console.log('User not found');
 *
 * @throws {Error} If there's an issue during the database connection or querying process.
 */
export const getProfile = async (user: {
	id: string;
}): Promise<IAuthUser | null> => {
	try {
		await connectDB();
		const authUser = (await User.findOne({ _id: user.id })
			.lean()
			.exec()) as IAuthUser | null;
		//Clean up the user object before returning it.
		if (authUser) {
			authUser._id = authUser._id.toString(); // Convert _id to string
			delete authUser.__v; // Remove the __v field
			// Add firstName and lastName if not present
			if (!authUser.firstName) {
				authUser.firstName = ''; // Default value or use another default
			}
			if (!authUser.lastName) {
				authUser.lastName = ''; // Default value or use another default
			}
		}
		return authUser;
	} catch (error) {
		console.error('Error fetching user from DB:', error);
		return null;
	}
};

export const editUserAvatar = async (
	id: string,
	imageUri: string
): Promise<boolean> => {
	let isUpdated = false;

	console.log('@@editUserAvatar', id, imageUri);
	// get session
	const session = await getSession();
	const user = session?.user || null;

	// check user exists
	if (!user) {
		console.error('User not found');
		return isUpdated;
	}
	// comfirm user and updated userid are same before updating
	if (user.id !== id) {
		console.error('User not found');
		return isUpdated;
	}

	// Update the user's password in the database
	await connectDB();
	await User.updateOne({ _id: id }, { $set: { imageUri: imageUri } });
	isUpdated = true;
	return isUpdated;
};

/**
 * Fetches the avatar URL of the authenticated user.
 *
 * @returns {Promise<string | null>} A promise that resolves to the avatar URL if found, or null if not.
 *
 * @throws {Error} If there's an issue during the database connection or querying process.
 */
export const getUserAvatar = async (): Promise<string | null> => {
	try {
		console.log('getUserAvatar Called');
		const session = await getSession();
		const user = session?.user || null;

		if (!user) {
			console.error('User not found');
			return null;
		}
		await connectDB();
		const foundUser = (await User.findOne({
			_id: user.id,
		})
			.lean()
			.exec()) as IUser | null;
		if (!foundUser) {
			console.error('User not found in database');
			return null;
		}

		return foundUser.imageUri || null;
	} catch (error) {
		console.error('Error fetching user avatar from DB:', error);
		return null;
	}
};

export const removeAvatarFromDB = async (): Promise<boolean> => {
	let isDeleted = false;

	// get session
	const session = await getSession();
	const user = session?.user || null;

	// check user exists
	if (!user) {
		console.error('User not found');
		return isDeleted;
	}

	// Update the user's password in the database
	await connectDB();
	await User.updateOne({ _id: user.id }, { $set: { imageUri: '' } });
	isDeleted = true;
	return isDeleted;
};
