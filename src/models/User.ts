import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
	id: string;
	firstName?: string;
	lastName?: string;
	userName?: string;
	email: string;
	role: 'user' | 'admin';
	password: string;
	imageUri: string;
	provider: 'google' | 'github' | 'email' | 'generated';
	accountVerified: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

// Define the schema
const userSchema = new Schema<IUser>(
	{
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		userName: {
			type: String,
		},
		password: {
			type: String,
			minlength: 6,
		},
		imageUri: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				'Email is invalid, please enter a valid email address',
			],
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		provider: {
			type: String,
			enum: ['google', 'github', 'email', 'generated'],
			default: 'email',
		},
		accountVerified: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

export const User =
	mongoose.models?.User || mongoose.model<IUser>('User', userSchema);
