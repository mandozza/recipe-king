import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import FavoriteBtn from '@/components/blocks/bricks/FavoriteBtn';
import { AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

const CardBlock: React.FC<Recipe> = ({
	_id,
	title,
	image,
	time,
	description,
	vegan,
}) => {
	return (
		<Card className="flex flex-col justify-between">
			<div className="flex justify-end ">
				<FavoriteBtn _id={_id} />
			</div>
			<CardHeader className="flex-row gap-4 items-center">
				<Avatar>
					<AvatarImage src={`/img/${image}`} alt={`${title} image`} />
					<AvatarFallback>{title.slice(0, 2)}</AvatarFallback>
				</Avatar>
				<div>
					<CardTitle>{title}</CardTitle>
					<CardDescription className="flex gap-2">
						<AlarmClock />
						{time} mins to cook.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<p>{description}</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="default" asChild>
					<Link href="/viewrecipe">View Recipe</Link>
				</Button>
				{vegan && <Badge variant="secondary">Vegan!</Badge>}
			</CardFooter>
		</Card>
	);
};
export default CardBlock;
