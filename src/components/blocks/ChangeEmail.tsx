'use client';

import { IAuthUser } from '@/types/user';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AlertBox from '@/components/blocks/bricks/AlertBox';
import { editUserEmail } from '@/data/users';

interface EditEmailProps {
	user: IAuthUser;
}

/**
 * ChangeEmail component allows authenticated users to change their email address.
 *
 * @component
 * @param {EditEmailProps} props - The properties for the ChangeEmail component.
 * @param {IAuthUser} props.user - The authenticated user object containing user details.
 *
 * @returns {JSX.Element} The rendered ChangeEmail component.
 *
 * @example
 * <ChangeEmail user={user} />
 *
 * @remarks
 * This component includes client-side email validation and displays success or error messages
 * based on the result of the email update operation.
 *
 * @function handleSubmit
 * Handles the form submission to update the user's email address.
 *
 * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
 *
 * @returns {Promise<void>} A promise that resolves when the email update operation is complete.
 *
 * @remarks
 * The handleSubmit function performs client-side validation for the email address and calls the
 * `editUserEmail` function to update the email. It also manages the loading state and displays
 * appropriate success or error messages.
 */
const ChangeEmail: React.FC<EditEmailProps> = ({ user }) => {
	//define State
	const [isLoading, setIsLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState({ type: '', message: '' });
	const [email, setEmail] = useState(user?.email);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsError(false);
		showAlert && setShowAlert(false);
		// trim email
		setEmail(email.trim());
		// email validation client side.
		if (!email) {
			setIsError(true);
			setMessage({ type: 'error', message: 'Email is required' });
			return;
		}
		if (!email.includes('@')) {
			setIsError(true);
			setMessage({ type: 'error', message: 'Email is invalid' });
			return;
		}
		const isUpdated = await editUserEmail({ id: user._id, email: email });
		isLoading && setIsLoading(false);
		if (isUpdated) {
			setIsError(false);
			setMessage({
				type: 'success',
				message: 'Email updated successfully',
			});
		} else {
			setIsError(true);
			setMessage({ type: 'error', message: 'Failed to update email' });
		}
	};
	return (
		<>
			{showAlert && (
				<AlertBox
					title={message?.type}
					description={message?.message}
					classes={
						isError
							? 'bg-red-100 text-red-900'
							: 'bg-green-100 text-green-900'
					}
				/>
			)}
			<Card className="max-w-lg mb-5">
				<CardHeader>
					<CardTitle className="text-2xl">
						Change Email Address
					</CardTitle>
					<CardDescription>
						Change your email by filling out the form below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4" onSubmit={handleSubmit}>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="joedoe@example.com"
								defaultValue={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						{user?.provider === 'email' && (
							<Button
								type="submit"
								className="w-full"
								onClick={() => setIsLoading(!isLoading)}
							>
								{isLoading
									? 'Saving Email Change...'
									: 'Change Email'}
							</Button>
						)}
					</form>
				</CardContent>
			</Card>
		</>
	);
};
export default ChangeEmail;
