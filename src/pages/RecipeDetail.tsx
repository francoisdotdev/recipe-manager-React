import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recipes from "../data/recipes.json";

export default function Recetteqs() {
  const { name } = useParams();
  const navigate = useNavigate();

  const decodedName = decodeURIComponent(name || "");
  const recipe = recipes.find((r: any) => r.name === decodedName);

  const [servings, setServings] = useState<number>(recipe?.servings ?? 1);

  const factor = useMemo(() => {
    const base = recipe?.servings ?? 1;
    if (!base || base <= 0) return 1;
    if (!servings || servings <= 0) return 1;
    return servings / base;
  }, [recipe, servings]);

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ing: any) => {
      const q = Number(ing.quantity);
      const scaledQty = Number.isFinite(q) ? q * factor : ing.quantity;
      return { ...ing, scaledQty };
    });
  }, [recipe, factor]);

  const formatQty = (v: any) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return String(v);
    const rounded = Math.round(n * 100) / 100;
    return String(rounded);
  };

  if (!recipe) {
    return (
      <div>
        <button onClick={() => navigate(-1)}>Retour</button>
        <p>Recette introuvable</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Retour</button>

      <h1>{recipe.name}</h1>

      <img src={recipe.image} alt={recipe.name} width="300" />

      <p>Type : {recipe.type}</p>
      <p>Pays : {recipe.cuisine}</p>
      <p>Difficulté : {recipe.difficulty}</p>
      <p>Temps de préparation : {recipe.prepTime} min</p>
      <p>Temps de cuisson : {recipe.cookTime} min</p>
      <p>Rating : ⭐ {recipe.rating}</p>

      <div>
        <p>Portions (servings) :</p>
        <input
          type="number"
          min={1}
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
        />
        <p>
          Base : {recipe.servings} → Actuel : {servings}
        </p>
      </div>

      <h2>Ingrédients</h2>
      <ul>
        {scaledIngredients.map((ing: any, index: number) => (
          <li key={index}>
            {formatQty(ing.scaledQty)} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      <h2>Steps</h2>
      <ol>
        {recipe.steps.map((step: string, index: number) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  );
}