import { Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

//create an interface to define the props
interface AlertBoxProps {
	classes?: string;
	title?: string;
	description?: string;
}

const AlertBox: React.FC<AlertBoxProps> = ({
	title = 'Heads Up!',
	description = 'This is an alert box',
	classes,
}) => {
	return (
		<Alert className={`col-span-2 w-full ${classes}`}>
			<Terminal className="h-4 w-4" />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{description}</AlertDescription>
		</Alert>
	);
};
export default AlertBox;
