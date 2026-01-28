// src/components/RecipeCard.tsx
import { useNavigate } from "react-router-dom";
import recipes from "../data/recipes.json";

type Props = {
  filterType: string | null;
  filterValue: string | null;
  search: string;
};

export default function RecipeCard({ filterType, filterValue, search }: Props) {
  const navigate = useNavigate();

  const norm = (v: any) => String(v ?? "").trim().toLowerCase();
  const getTotalTime = (recipe: any) => recipe.prepTime + recipe.cookTime;

  const filteredRecipes = recipes.filter((recipe: any) => {
    if (search && !norm(recipe.name).includes(norm(search))) return false;

    if (!filterType || !filterValue) return true;

    if (filterType === "type") return norm(recipe.type) === norm(filterValue);
    if (filterType === "difficulty") return norm(recipe.difficulty) === norm(filterValue);
    if (filterType === "cuisine") return norm(recipe.cuisine) === norm(filterValue);

    if (filterType === "cooktime") {
      const total = getTotalTime(recipe);
      const [min, max] = String(filterValue).split("-").map(Number);
      return total >= min && total < max;
    }

    return true;
  });

  return (
    <ul>
      {filteredRecipes.map((recipe: any) => (
        <li key={recipe.name}>
          {recipe.name}{" "}
          <button onClick={() => navigate(`/recipe/${encodeURIComponent(recipe.name)}`)}>
            Détails
          </button>
        </li>
      ))}
    </ul>
  );
}