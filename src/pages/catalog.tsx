import { useState } from "react";
import recipes from "../data/recipes.json";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../hooks/useFavorites";

export default function Catalog() {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const cuisines = Array.from(new Set(recipes.map((r: any) => r.cuisine)));

  return (
    <div>
      <h1>Catalogue</h1>

      <input
        type="text"
        placeholder="Rechercher une recette..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div>
        <button
          onClick={() => {
            setFilterType("type");
            setFilterValue(null);
          }}
        >
          Type
        </button>
        <button
          onClick={() => {
            setFilterType("difficulty");
            setFilterValue(null);
          }}
        >
          Difficulty
        </button>
        <button
          onClick={() => {
            setFilterType("cuisine");
            setFilterValue(null);
          }}
        >
          Pays
        </button>
        <button
          onClick={() => {
            setFilterType("cooktime");
            setFilterValue(null);
          }}
        >
          Cooktime
        </button>
        <button
          onClick={() => {
            setFilterType(null);
            setFilterValue(null);
            setSearch("");
          }}
        >
          Reset
        </button>
      </div>

      <div>
        {filterType === "type" && (
          <>
            <button onClick={() => setFilterValue("plat")}>Plat</button>
            <button onClick={() => setFilterValue("dessert")}>Dessert</button>
            <button onClick={() => setFilterValue("entrée")}>Entrée</button>
          </>
        )}

        {filterType === "difficulty" && (
          <>
            <button onClick={() => setFilterValue("Facile")}>Facile</button>
            <button onClick={() => setFilterValue("Moyen")}>Moyen</button>
            <button onClick={() => setFilterValue("Difficile")}>Difficile</button>
          </>
        )}

        {filterType === "cuisine" &&
          cuisines.map((cuisine) => (
            <button key={cuisine} onClick={() => setFilterValue(cuisine)}>
              {cuisine}
            </button>
          ))}

        {filterType === "cooktime" && (
          <>
            <button onClick={() => setFilterValue("0-10")}>0–10 min</button>
            <button onClick={() => setFilterValue("10-20")}>10–20 min</button>
            <button onClick={() => setFilterValue("20-30")}>20–30 min</button>
            <button onClick={() => setFilterValue("30-40")}>30–40 min</button>
            <button onClick={() => setFilterValue("40-50")}>40–50 min</button>
            <button onClick={() => setFilterValue("50-60")}>50–60 min</button>
            <button onClick={() => setFilterValue("60-500")}>60 min et +</button>
          </>
        )}
      </div>

      <RecipeCard
        filterType={filterType}
        filterValue={filterValue}
        search={search}
        renderActions={(recipe: any) => (
          <button
            onClick={(e) => {
              e.stopPropagation?.();
              if (isFavorite(recipe.id)) removeFavorite(recipe.id);
              else addFavorite(recipe);
            }}
          >
            {isFavorite(recipe.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
          </button>
        )}
      />
    </div>
  );
}