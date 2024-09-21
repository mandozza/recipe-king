import { getSession } from '@/lib/session';
import { register } from '@/data/users';

import Link from 'next/link';
import { redirect } from 'next/navigation';
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

const SignUpPage = async () => {
	// Check if the user is already logged in
	const session = await getSession();
	const user = session?.user;
	// If the user is already logged in, redirect them to the home page
	if (user) redirect('/');

	return (
		<Card className="mx-auto max-w-md">
			<CardHeader>
				<CardTitle className="text-2xl">Register</CardTitle>
				<CardDescription>
					Create a new account by filling out the form below
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="grid gap-4" action={register}>
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
						Register
					</Button>
				</form>
				<div className="mt-4 text-center text-sm">
					Already have an account?{' '}
					<Link href="/login" className="underline">
						Log in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
};
export default SignUpPage;
