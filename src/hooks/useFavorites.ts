import { useState, useEffect } from "react";
import type { Recipe } from "../types/recipes";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (recipe: Recipe) => {
    if (!favorites.find((r) => r.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
    }
  };

  const removeFavorite = (recipeId: number) => {
    setFavorites(favorites.filter((r) => r.id !== recipeId));
  };
  const isFavorite = (recipeId: number) => {
    return favorites.some((r) => r.id === recipeId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}