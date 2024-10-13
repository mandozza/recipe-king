import { object, string } from 'zod';

/**
 * Validation schema for the sign-in form.
 *
 * @type {object}
 *
 * @property {string} email - The email address of the user.
 *    - Required with a minimum length of 1 character.
 *    - Must be a valid email format.
 *    - Error messages: "Email is required", "Invalid email".
 *
 * @property {string} password - The user's password.
 *    - Required with a minimum length of 8 characters and a maximum of 32 characters.
 *    - Error messages: "Password is required", "Password must be more than 8 characters", "Password must be less than 32 characters".
 *
 * @example
 * const result = signInSchema.parse({ email: 'test@example.com', password: 'myPassword123' });
 * console.log(result);
 *
 * @throws {ZodError} If the validation fails for either the email or the password.
 */
export const signInSchema = object({
	email: string({ required_error: 'Email is required' })
		.min(1, 'Email is required')
		.email('Invalid email'),
	password: string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
});

export const changePasswordSchema = object({
	password: string({ required_error: 'Password is required' })
		.min(1, 'Password is required')
		.min(8, 'Password must be more than 8 characters')
		.max(32, 'Password must be less than 32 characters'),
});
