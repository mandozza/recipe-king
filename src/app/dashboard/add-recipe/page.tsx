import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import UploadImage from '@/components/blocks/bricks/UploadImage';

const AddRecipePage = async () => {
	const session = await getSession();
	const user = session?.user || null;

	// Redirect to login if user is not found
	if (!user || !user.id) {
		redirect('/login');
		return null;
	}

	return (
		<div className="mx-auto max-w-screen-lg">
			Add Recipe Page
			<UploadImage />
		</div>
	);
};
export default AddRecipePage;
