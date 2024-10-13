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
import { editUserEmail } from '@/data/users';

interface EditEmailProps {
	user: IAuthUser;
	onShowAlert: (
		msg: { type: string; message: string },
		error: boolean
	) => void;
}

const ChangeEmail: React.FC<EditEmailProps> = ({ user, onShowAlert }) => {
	//define State
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState(user?.email);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// trim email
		setEmail(email.trim());
		// email validation client side.
		if (!email) {
			onShowAlert(
				{
					type: 'Error',
					message: 'Email is required',
				},
				true
			);
			return;
		}
		if (!email.includes('@')) {
			onShowAlert(
				{
					type: 'Error',
					message: 'Email is invalid',
				},
				true
			);
			return;
		}

		setIsLoading(true);
		try {
			await editUserEmail({ id: user._id, email: email });
			onShowAlert(
				{ type: 'Success', message: 'Email updated successfully' },
				false
			);
		} catch (error) {
			onShowAlert(
				{ type: 'Error', message: 'Failed to update email' },
				true
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
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
