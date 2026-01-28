import { useFavorites } from "../hooks/useFavorites";
import { type Recipe } from "../types/recipes";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  return (
    <div>
      <h3>{recipe.name}</h3>
      <button
        onClick={() =>
          isFavorite(recipe.id)
            ? removeFavorite(recipe.id)
            : addFavorite(recipe)
        }
      >
        {isFavorite(recipe.id) ? "💖 Remove Favorite" : "🤍 Add Favorite"}
      </button>
    </div>
  );
}
