import {
	PutObjectCommand,
	HeadObjectCommand,
	DeleteObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { NextRequest } from 'next/server';
import uniqid from 'uniqid';
import { getUserAvatar, editUserAvatar } from '@/data/users';

export async function POST(req: NextRequest) {
	console.log('uploading API');
	const data = await req.formData();
	const file = data.get('file') as File;
	const folder = data.get('folder') as string;
	const user_id = data.get('user_id') as string;

	// set up the S3 client
	const s3Client = new S3Client({
		region: 'us-east-1',
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY as string,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
		},
	});

	const bucketName = process.env.S3_BUCKET_NAME as string;
	const baseUrl = `https://${bucketName}.s3.amazonaws.com/`;

	// get the users current avatar
	const UserAvatar = await getUserAvatar();

	// check if the baseurl is present in UserAvatar if present delete the file
	if (UserAvatar) {
		if (UserAvatar.includes(baseUrl)) {
			// split the string by /
			const splitUrl = UserAvatar.split('/');
			// get the last element of the array
			const fileName = splitUrl[splitUrl.length - 1];

			try {
				// delete the file from the bucket
				const deleteParams = {
					Bucket: bucketName,
					Key: folder ? `${folder}/${fileName}` : fileName,
				};
				await s3Client.send(new DeleteObjectCommand(deleteParams));
			} catch (error) {
				console.error('Error deleting file', error);
				return new Response(
					JSON.stringify({ error: 'Failed to delete orginal image' }),
					{
						status: 500,
					}
				);
			}
		}
	}

	// Check if the file type is one of the allowed image formats
	const allowedTypes = ['image/jpeg', 'image/webp', 'image/png'];
	if (!allowedTypes.includes(file.type)) {
		return new Response(JSON.stringify({ error: 'Invalid file type' }), {
			status: 400,
		});
	}

	// check for spaces in the filename and replace them with dashes
	const newFilename = `${uniqid()}-${file.name.replace(/\s+/g, '-')}`;

	console.log('newFilename', newFilename);
	// blob data of our file
	const chunks = [];
	//@ts-expect-error - stream
	for await (const chunk of file.stream()) {
		chunks.push(chunk);
	}
	const buffer = Buffer.concat(chunks);

	await s3Client.send(
		new PutObjectCommand({
			Bucket: bucketName,
			Key: `${folder}/${newFilename}`,
			ACL: 'public-read',
			Body: buffer,
			ContentType: file.type,
		})
	);

	// Check if the file was uploaded successfully
	try {
		const headObjectCommand = new HeadObjectCommand({
			Bucket: bucketName,
			Key: `${folder}/${newFilename}`,
		});
		await s3Client.send(headObjectCommand);
	} catch (error) {
		return new Response(JSON.stringify({ error: 'File upload failed' }), {
			status: 500,
		});
	}
	// create the public URL of the uploaded file
	const newUrl = `https://${bucketName}.s3.amazonaws.com/${folder}/${newFilename}`;

	// update user in database
	const userUpdated = await editUserAvatar(user_id, newUrl);

	if (!userUpdated) {
		return new Response(
			JSON.stringify({ error: 'Failed to update user avatar' }),
			{
				status: 500,
			}
		);
	}

	// Return the new filename and the public URL of the uploaded file
	return Response.json({
		newFilename,
		url: `https://${bucketName}.s3.amazonaws.com/${folder}/${newFilename}`,
	});
}
