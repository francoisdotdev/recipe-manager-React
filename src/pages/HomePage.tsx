import { RecipeList } from "../components/recipe/RecipeList";

export function HomePage() {
	return (
		<div>
			<h1 className="page-title">Toutes les recettes</h1>
			<RecipeList />
		</div>
	);
}
