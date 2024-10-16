'use client';

import { ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { CircleUser, LoaderCircle } from 'lucide-react';
import { IAuthUser } from '@/types/user';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

interface EditAvatarProps {
	user: IAuthUser;
	onShowAlert: (
		msg: { type: string; message: string },
		error: boolean
	) => void;
}

const ChangeAvatar: React.FC<EditAvatarProps> = ({ user, onShowAlert }) => {
	//define State
	const fileInRef = useRef<HTMLInputElement>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [url, setUrl] = useState(user?.imageUri);

	async function upload(ev: ChangeEvent<HTMLInputElement>) {
		console.log('uploading');
		const input = ev.target as HTMLInputElement;

		if (input && input.files?.length && input.files.length > 0) {
			setIsUploading(true);
			try {
				const file = input.files[0];
				const data = new FormData();
				data.set('folder', 'avatars');
				data.set('file', file);
				data.set('user_id', user._id);
				const response = await axios.post('/api/avatar/upload', data);
				setUrl(response.data.url);
				onShowAlert(
					{ type: 'Success', message: 'Avatar Changed' },
					false
				);
			} catch (error) {
				onShowAlert(
					{ type: 'Error', message: 'Failed to upload image' },
					true
				);
			} finally {
				setIsUploading(false);
			}
		}
	}

	async function deleteAvatar() {
		console.log('deleting');
		try {
			const response = await axios.post('/api/avatar/delete', {
				user_id: user._id,
				folder: 'avatars',
			});
			if (response.data.success) {
				setUrl('');
				onShowAlert(
					{ type: 'Success', message: 'Avatar Deleted' },
					false
				);
			}
		} catch (error) {
			onShowAlert(
				{ type: 'Error', message: 'Failed to delete image' },
				true
			);
		}
	}

	return (
		<>
			<Card className="mb-5">
				<CardHeader>
					<CardTitle>Change Avatar</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center">
						{isUploading && (
							<LoaderCircle className="text-gray-400 w-24 h-24 animate-spin" />
						)}
						{!isUploading && url && (
							<Image
								src={url}
								alt={'uploaded image'}
								width={1024}
								height={1024}
								onLoad={() => setIsUploading(false)}
								className="w-auto h-auto max-w-24 max-h-24"
							/>
						)}
						{!isUploading && !url && (
							<p className="flex justify-center">
								<CircleUser className="text-gray-400 w-24 h-24" />
							</p>
						)}
					</div>

					<Input type="hidden" value={url} name="avatar_image" />
					<Input
						onChange={(ev) => upload(ev)}
						ref={fileInRef}
						type="file"
						className="hidden"
					/>
					<CardDescription>
						Change or delete you profile picture
					</CardDescription>
					<div className="flex space-x-4 mt-4">
						<Button
							type="button"
							className="flex-1"
							onClick={() => fileInRef.current?.click()}
						>
							Change Avatar
						</Button>
						<Button
							type="button"
							className="flex-1"
							onClick={deleteAvatar}
						>
							Delete Avatar
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
};

export default ChangeAvatar;
