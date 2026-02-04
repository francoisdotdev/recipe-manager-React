import { RecipeDetail } from "../components/recipe/RecipeDetail";

interface RecipePageProps {
	recipeId: number;
}

export function RecipePage({ recipeId }: RecipePageProps) {
	return <RecipeDetail recipeId={recipeId} />;
}
