import { getRecipes } from '@/data/recipes';
import { Recipe } from '@/types/recipe';
import CardBlock from '@/components/blocks/CardBlock';

export default async function Home() {
	console.log('***** PAGE LOAD *****');
	const recipes = await getRecipes();
	return (
		<main>
			<div className="grid grid-cols-3 gap-8">
				{recipes.map((recipe: Recipe) => (
					<CardBlock
						key={recipe._id.toString()}
						_id={recipe._id.toString()}
						title={recipe.title}
						image={recipe.image}
						time={recipe.time}
						description={recipe.description}
						vegan={recipe.vegan}
					/>
				))}
			</div>
		</main>
	);
}
