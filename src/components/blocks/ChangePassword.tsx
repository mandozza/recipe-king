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
import { editUserPassword } from '@/data/users';

interface EditPasswordProps {
	user: IAuthUser;
}

const ChangePassword: React.FC<EditPasswordProps> = ({ user }) => {
	//define State
	const [isLoading, setIsLoading] = useState(false);
	const [showAlert, setShowAlert] = useState(false);
	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState({ type: '', message: '' });
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsError(false);
		setShowAlert(false);

		// password validation client side.
		if (!password) {
			setIsError(true);
			setMessage({ type: 'error', message: 'Password is required' });
			return;
		}
		if (!confirmPassword) {
			setIsError(true);
			setMessage({
				type: 'error',
				message: 'Confirm Password is required',
			});
			return;
		}
		if (password !== confirmPassword) {
			setIsError(true);
			setMessage({ type: 'error', message: 'Passwords do not match' });
			return;
		}
		if (password.length < 8) {
			setIsError(true);
			setMessage({
				type: 'error',
				message: 'Password must be at least 8 characters',
			});
			return;
		}
		setIsLoading(true);
		const isUpdated = await editUserPassword({
			id: user._id,
			password: password,
		});

		isLoading && setIsLoading(false);
		if (isUpdated) {
			setIsError(false);
			setMessage({
				type: 'success',
				message: 'Email updated successfully',
			});
		} else {
			setIsError(true);
			setMessage({
				type: 'error',
				message: 'Failed to update email',
			});
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
			<Card className="mx-auto max-w-md mb-5">
				<CardHeader>
					<CardTitle className="text-2xl">Change Password</CardTitle>
					<CardDescription>
						Change your password by filling out the form below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4" onSubmit={handleSubmit}>
						<div className="grid gap-2">
							<Label htmlFor="password">New Password</Label>
							<Input
								id="password"
								type="password"
								name="password"
								placeholder="Enter new password"
								value={password}
								onChange={(e) =>
									setPassword(e.target.value.trim())
								}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="confirmPassword">
								Confirm New Password
							</Label>
							<Input
								id="confirmPassword"
								type="password"
								name="confirmPassword"
								placeholder="Confirm new password"
								value={confirmPassword}
								onChange={(e) =>
									setConfirmPassword(e.target.value.trim())
								}
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
export default ChangePassword;
