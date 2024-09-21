import bcrypt from 'bcrypt';

/**
 * Salts and hashes a given password using bcrypt.
 *
 * @param {string} password - The plain-text password to be salted and hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 *
 * @example
 * const hashedPassword = await saltAndHashPassword('myPassword123');
 * console.log(hashedPassword);
 *
 * @throws {Error} If bcrypt encounters an issue while generating the salt or hashing the password.
 */
export const saltAndHashPassword = async (
	password: string
): Promise<string> => {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

/**
 * Compares a plain-text password to a stored hashed password.
 *
 * @param {string} enteredPassword - The plain-text password to compare.
 * @param {string} storedHashedPassword - The stored hashed password to compare against.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the passwords match.
 *
 * @example
 * const passwordsMatch = await comparePassword('myPassword123', '$2b$10$JZ0Y5fIq4jZ3zv3Y3m8p7eF9w2Qk3qW6vQ
 * 	// true
 * console
 * 	// false
 *
 * @throws {Error} If bcrypt encounters an issue while comparing the passwords.
 */
export const comparePassword = async (
	enteredPassword: string,
	storedHashedPassword: string
): Promise<boolean> => {
	return await bcrypt.compare(enteredPassword, storedHashedPassword);
};
