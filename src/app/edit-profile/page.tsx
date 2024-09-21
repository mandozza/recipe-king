import { getSession } from '@/lib/session';
import { editProfile, getProfile } from '@/data/users';
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

const EditProfilePage = async () => {
	const session = await getSession();
	const user = session?.user || null;
	console.log('###User###:', user);
	//get user details
	const userDetails = await getProfile({ user });
	console.log('###UserDetails###:', userDetails);

	return (
		<Card className="mx-auto max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Edit Profile</CardTitle>
				<CardDescription>
					Edit your profile by filling out the form below
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" action={editProfile}>
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								name="firstName"
								type="text"
								required
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								name="lastName"
								type="text"
								required
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="jj@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						Edit Profile
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
export default EditProfilePage;
