import { auth } from '~/auth';
import { cache } from 'react';

/**
 * Retrieves and caches the current user session using authentication.
 *
 * @returns {Promise<Session | null>} A promise that resolves to the session object or null if no session is found.
 *
 * @example
 * const session = await getSession();
 * if (session) {
 *   console.log('User session:', session);
 * } else {
 *   console.log('No active session');
 * }
 *
 * @throws {Error} If there is an issue with retrieving the session.
 */
export const getSession = cache(async () => {
	const session = await auth();
	return session;
});
