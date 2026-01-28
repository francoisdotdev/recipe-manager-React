import recipes from "../data/recipes.json";

type Props = {
  filterType: string | null;
  filterValue: string | null;
  search: string;
};

export default function RecipeCard({ filterType, filterValue, search }: Props) {
  const getTotalTime = (recipe: any) =>
    recipe.prepTime + recipe.cookTime;

  const filteredRecipes = recipes.filter((recipe: any) => {
    if (
      search &&
      !recipe.name.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    if (!filterType || !filterValue) return true;

    if (filterType === "type") {
      return recipe.type === filterValue;
    }

    if (filterType === "difficulty") {
      return recipe.difficulty === filterValue;
    }

    if (filterType === "cuisine") {
      return recipe.cuisine === filterValue;
    }

    if (filterType === "cooktime") {
      const total = getTotalTime(recipe);
      const [min, max] = filterValue.split("-").map(Number);
      return total >= min && total < max;
    }

    return true;
  });

  return (
    <ul>
      {filteredRecipes.map((recipe: any) => (
        <li key={recipe.id}>{recipe.name}</li>
      ))}
    </ul>
  );
}