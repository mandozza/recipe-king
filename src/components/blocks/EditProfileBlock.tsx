'use client';
import { useState } from 'react';
import { IAuthUser } from '@/types/user';
import AlertBox from '@/components/blocks/bricks/AlertBox';
import ChangeEmail from '@/components/blocks/ChangeEmail';
import ChangePassword from '@/components/blocks/ChangePassword';
import ChangeProfile from '@/components/blocks/ChangeProfile';
import ChangeAvatar from '@/components/blocks/ChangeAvatar';

interface EditProfileBlockProps {
	user: IAuthUser;
}

const EditProfileBlock: React.FC<EditProfileBlockProps> = ({ user }) => {
	// set up state
	const [showAlert, setShowAlert] = useState(false);
	const [message, setMessage] = useState<{
		type: string;
		message: string;
	} | null>(null);
	const [isError, setIsError] = useState(false);

	const handleShowAlert = (
		msg: { type: string; message: string },
		error: boolean
	) => {
		setMessage(msg);
		setIsError(error);
		setShowAlert(true);
	};

	return (
		<>
			{showAlert && (
				<AlertBox
					title={message?.type}
					description={message?.message}
					classes={
						isError
							? 'bg-red-100 text-red-900'
							: 'bg-green-100 text-green-900'
					}
				/>
			)}
			<ChangeProfile user={user} onShowAlert={handleShowAlert} />
			<ChangeAvatar user={user} onShowAlert={handleShowAlert} />
			{user.provider === 'email' && (
				<>
					<ChangeEmail user={user} onShowAlert={handleShowAlert} />
					<ChangePassword user={user} onShowAlert={handleShowAlert} />
				</>
			)}
		</>
	);
};
export default EditProfileBlock;
