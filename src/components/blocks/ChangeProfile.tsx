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
import { editUserProfile } from '@/data/users';

// Define the props interface for the EditProfile component
interface EditProfileProps {
	user: IAuthUser;
	onShowAlert: (
		msg: { type: string; message: string },
		error: boolean
	) => void;
}

const ChangeProfile: React.FC<EditProfileProps> = ({ user, onShowAlert }) => {
	//define State
	const [isLoading, setIsLoading] = useState(false);
	const [userName, setUserName] = useState(user?.userName);
	const [firstName, setFirstName] = useState(user?.firstName);
	const [lastName, setLastName] = useState(user?.lastName);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		//confirm all values are not empty
		if (!userName || !firstName || !lastName) {
			onShowAlert(
				{
					type: 'Error',
					message:
						'Please ensure Username, First Name and Last Name all have values',
				},
				true
			);
			return;
		}

		setIsLoading(true);
		try {
			await editUserProfile({
				userName,
				firstName,
				lastName,
			});
			isLoading && setIsLoading(false);
			onShowAlert(
				{ type: 'Success', message: 'Profile updated successfully' },
				false
			);
		} catch (error) {
			isLoading && setIsLoading(false);
			onShowAlert(
				{ type: 'Error', message: 'Failed to update Profile' },
				true
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Card className="mx-auto max-w-lg mb-5">
				<CardHeader>
					<CardTitle className="text-2xl">Edit Profile</CardTitle>
					<CardDescription>
						Edit your profile by filling out the form below
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className="grid gap-4" onSubmit={handleSubmit}>
						<div className="grid gap-2">
							<Label htmlFor="userName">User Name</Label>
							<Input
								id="userName"
								type="text"
								name="userName"
								placeholder="John Doe"
								defaultValue={userName}
								onChange={(e) =>
									setUserName(e.target.value.trim())
								}
								required
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="firstName">First Name</Label>
								<Input
									id="firstName"
									name="firstName"
									type="text"
									placeholder="John"
									defaultValue={firstName}
									onChange={(e) =>
										setFirstName(e.target.value.trim())
									}
									required
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="lastName">Last Name</Label>
								<Input
									id="lastName"
									name="lastName"
									type="text"
									placeholder="Doe"
									defaultValue={lastName}
									onChange={(e) =>
										setLastName(e.target.value.trim())
									}
									required
								/>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full"
							onClick={() => setIsLoading(!isLoading)}
						>
							{isLoading ? 'Loading...' : 'Edit Profile'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
};

export default ChangeProfile;
