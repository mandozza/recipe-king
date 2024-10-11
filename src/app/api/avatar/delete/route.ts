import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import { getUserAvatar, removeAvatarFromDB } from '@/data/users';

export async function POST(req: NextRequest) {
	const data = await req.json();
	const folder = data.folder || '';

	// set up the S3 client
	const s3Client = new S3Client({
		region: 'us-east-1',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY as string,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
		},
	});
	// get the user avatar
	const UserAvatar = await getUserAvatar();

	const bucketName = process.env.S3_BUCKET_NAME as string;
	const baseUrl = `https://${bucketName}.s3.amazonaws.com/`;

	//check if baseurl in present in UserAvatar
	if (UserAvatar) {
		if (UserAvatar.includes(baseUrl)) {
			//split the string by /
			const splitUrl = UserAvatar.split('/');
			//get the last element of the array
			const fileName = splitUrl[splitUrl.length - 1];

			try {
				//delete the file from the bucket
				const deleteParams = {
					Bucket: bucketName,
					Key: folder ? `${folder}/${fileName}` : fileName,
				};
				// delete the file from the bucket
				await s3Client.send(new DeleteObjectCommand(deleteParams));
				//remove the avatar from the database
				const profileUpdated = await removeAvatarFromDB();
				if (!profileUpdated) {
					return new Response(
						JSON.stringify({ error: 'Failed to update profile' }),
						{
							status: 500,
						}
					);
				}
				return new Response(
					JSON.stringify({ message: 'Image deleted' }),
					{
						status: 200,
					}
				);
			} catch (error) {
				console.error('Error deleting file', error);
				return new Response(
					JSON.stringify({ error: 'Failed to delete image' }),
					{
						status: 500,
					}
				);
			}
		}
		return new Response(JSON.stringify({ error: 'Image not hosted' }), {
			status: 400,
		});
	}
	return new Response(
		JSON.stringify({ error: 'Failed Avatar can not be found' }),
		{
			status: 500,
		}
	);
}
