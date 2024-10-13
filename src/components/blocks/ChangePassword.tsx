'use client';

import { IAuthUser } from '@/types/user';
import { useState, useEffect } from 'react';
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
import { editUserPassword } from '@/data/users';

interface EditPasswordProps {
	user: IAuthUser;
	onShowAlert: (
		msg: { type: string; message: string },
		error: boolean
	) => void;
}

const ChangePassword: React.FC<EditPasswordProps> = ({ user, onShowAlert }) => {
	//define State
	const [isLoading, setIsLoading] = useState(false);
	const [canUpdatePassword, setCanUpdatePassword] = useState(false);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	useEffect(() => {
		// Logic to determine if the password can be updated
		if (password.length >= 8 && password === confirmPassword) {
			setCanUpdatePassword(true);
		} else {
			setCanUpdatePassword(false);
		}
	}, [password, confirmPassword]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			onShowAlert(
				{ type: 'Error', message: 'Passwords do not match.' },
				true
			);
			return;
		}
		if (password.length < 8) {
			onShowAlert(
				{
					type: 'Error',
					message: 'Password must be at least 8 characters long.',
				},
				true
			);
			return;
		}
		setIsLoading(true);
		try {
			await editUserPassword({
				id: user._id,
				password: password,
			});
			onShowAlert(
				{ type: 'Success', message: 'Password changed successfully.' },
				false
			);
		} catch (error) {
			onShowAlert(
				{ type: 'Error', message: 'Failed to change password.' },
				true
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
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
						{user?.provider === 'email' && canUpdatePassword && (
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
