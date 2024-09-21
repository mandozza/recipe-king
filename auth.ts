import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/lib/zod';
import { ZodError } from 'zod';
import {
	authUserFromDb,
	UserExist,
	addAuthUserToDB,
	getAuthUserDetails,
} from '@/data/users';

interface User {
	id: string;
	name: string;
	email: string;
	image: string;
}

/**
 * Handles authentication logic using NextAuth.
 *
 * Exports the following:
 * - `handlers`: Auth API route handlers for NextAuth.
 * - `signIn`: Method to sign users in.
 * - `signOut`: Method to sign users out.
 * - `auth`: General NextAuth authentication handler.
 *
 * Configured with the following providers:
 * - Google OAuth
 * - Github OAuth
 *
 * Pages:
 * - Custom sign-in page: '/login'
 *
 * Callbacks:
 * - `signIn`: Custom sign-in logic to log user and account data, allowing sign-in
 *   only if the provider is either Google or Github.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({}),
		GithubProvider({}),
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials) => {
				console.log('###AUTHORIZE###');
				console.log('Credentials:', credentials);
				try {
					let user = null;
					const { email, password } = await signInSchema.parseAsync(
						credentials
					);
					// logic to verify if the user exists
					user = await authUserFromDb(email, password);
					console.log('#####Retrieved User###:', user);

					if (!user) {
						console.error('Invalid credentials');

						//TODO need to figure this out laterb ecause it's not working for now
						//https://github.com/nextauthjs/next-auth/issues/9900
						//https://authjs.dev/getting-started/providers/credentials
						//https: throw new Error('User not found.');
					} else {
						console.log('#####RETURNED User:###', user);
						return user;
					}
				} catch (error) {
					if (error instanceof ZodError) {
						console.error('Validation error:', error.errors);
					} else {
						console.error('Error during authorization:', error);
					}
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		signIn: async ({ user, account }) => {
			console.log('###SIGNIN###');
			//console.log('User:', user);
			//console.log('Account:', account);
			// check if it's a non credentials provider
			if (
				account?.provider === 'google' ||
				account?.provider === 'github'
			) {
				console.log('### User is logging in with Google or Github ###');
				try {
					const { email, name, image } = user;
					const alreadyUser = await UserExist({
						email,
						provider: account.provider,
					});
					console.log(
						'Check User exists in the database:',
						alreadyUser
					);
					if (!alreadyUser) {
						console.log('User does not exist in the database');
						// user is not in the database, ie first login so create a new user
						const provider = account?.provider ?? 'unknown';
						addAuthUserToDB({
							email,
							name,
							image,
							provider: provider,
							accountVerified: true,
						});
					} else {
						return true;
					}
				} catch (error) {
					console.log('Error creating user:', error);
				}
			}
			return !!user;
		},
		session: async ({ session }) => {
			/** Need to look at JWT TOKEN solution since this is constructed on ever page */
			const user = await getAuthUserDetails(session.user.email);
			session.user.id = user?.id.toString();
			session.user.name = user?.userName;
			session.user.role = user?.role;
			session.user.provider = user?.provider;
			return session;
		},
	},
});
