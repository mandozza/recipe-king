export interface IAuthUser {
	_id: string;
	firstName?: string;
	lastName?: string;
	userName?: string;
	imageUri?: string;
	email: string;
	password?: string;
	role: string;
	provider: string;
	accountVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	__v?: number;
}
