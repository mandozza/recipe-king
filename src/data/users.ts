'use server';

import connectDB from '@/lib/db';
import { User, IUser } from '@/models/User';
import { redirect } from 'next/navigation';
import { saltAndHashPassword, comparePassword } from '@/lib/password';

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
	console.log('formData:', formData);
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
		const userDetail = {
			id: user?._id,
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

export const editProfile = async (formData: FormData) => {
	//await connectDB();
};

export const getProfile = async ({ user }) => {
	try {
		await connectDB();
		const authUser = await User.findOne({ _id: user?.id }).lean().exec();
		return authUser;
	} catch (error) {
		console.error('Error fetching user from DB:', error);
		return null;
	}
};
