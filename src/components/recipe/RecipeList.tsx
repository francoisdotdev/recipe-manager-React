import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { RecipeCard } from "./RecipeCard";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import recipesData from "../../data/recipes.json";
import type { Recipe, RecipeType, Difficulty } from "../../types/recipe";

const recipes = recipesData as Recipe[];

type SortKey = "" | "rating" | "time" | "difficulty" | "name";

const CUISINES = [...new Set(recipes.map((r) => r.cuisine))].sort();

const difficultyOrder: Record<string, number> = {
	Facile: 1,
	Moyen: 2,
	Difficile: 3,
};

export function RecipeList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState<RecipeType | "">("");
	const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "">("");
	const [cuisineFilter, setCuisineFilter] = useState("");
	const [sortKey, setSortKey] = useState<SortKey>("");
	const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
	const [favorites, setFavorites] = useLocalStorage<number[]>("favorites", []);
	const [customRecipes] = useLocalStorage<Recipe[]>("myRecipes", []);

	const allRecipes = useMemo(
		() => [...recipes, ...customRecipes],
		[customRecipes],
	);

	const filteredAndSorted = useMemo(() => {
		const filtered = allRecipes.filter((recipe) => {
			const matchesSearch = recipe.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesType = !typeFilter || recipe.type === typeFilter;
			const matchesDifficulty =
				!difficultyFilter || recipe.difficulty === difficultyFilter;
			const matchesCuisine = !cuisineFilter || recipe.cuisine === cuisineFilter;
			const matchesFavorites =
				!showFavoritesOnly || favorites.includes(recipe.id);
			return (
				matchesSearch &&
				matchesType &&
				matchesDifficulty &&
				matchesCuisine &&
				matchesFavorites
			);
		});

		if (!sortKey) return filtered;

		return [...filtered].sort((a, b) => {
			switch (sortKey) {
				case "rating":
					return b.rating - a.rating;
				case "time":
					return a.prepTime + a.cookTime - (b.prepTime + b.cookTime);
				case "difficulty":
					return (
						(difficultyOrder[a.difficulty] ?? 0) -
						(difficultyOrder[b.difficulty] ?? 0)
					);
				case "name":
					return a.name.localeCompare(b.name);
				default:
					return 0;
			}
		});
	}, [
		allRecipes,
		searchTerm,
		typeFilter,
		difficultyFilter,
		cuisineFilter,
		sortKey,
		showFavoritesOnly,
		favorites,
	]);

	function toggleFavorite(id: number) {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
		);
	}

	return (
		<div className="recipe-list">
			<div className="filters">
				<input
					type="text"
					placeholder="Rechercher une recette..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="filters-search"
				/>
				<select
					value={typeFilter}
					onChange={(e) => setTypeFilter(e.target.value as RecipeType | "")}
					className="filters-select"
				>
					<option value="">Tous les types</option>
					<option value="entrée">Entrées</option>
					<option value="plat">Plats</option>
					<option value="dessert">Desserts</option>
				</select>
				<select
					value={difficultyFilter}
					onChange={(e) =>
						setDifficultyFilter(e.target.value as Difficulty | "")
					}
					className="filters-select"
				>
					<option value="">Toutes difficultés</option>
					<option value="Facile">Facile</option>
					<option value="Moyen">Moyen</option>
					<option value="Difficile">Difficile</option>
				</select>
				<select
					value={cuisineFilter}
					onChange={(e) => setCuisineFilter(e.target.value)}
					className="filters-select"
				>
					<option value="">Toutes cuisines</option>
					{CUISINES.map((c) => (
						<option key={c} value={c}>
							{c}
						</option>
					))}
				</select>
				<select
					value={sortKey}
					onChange={(e) => setSortKey(e.target.value as SortKey)}
					className="filters-select filters-sort"
				>
					<option value="">Trier par...</option>
					<option value="rating">Note</option>
					<option value="time">Temps total</option>
					<option value="difficulty">Difficulté</option>
					<option value="name">Nom</option>
				</select>
				<button
					type="button"
					onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
					className={`filters-favorites-btn ${showFavoritesOnly ? "is-active" : ""}`}
				>
					<Heart
						className={`icon-xs ${showFavoritesOnly ? "icon-filled" : ""}`}
					/>{" "}
					Favoris
				</button>
			</div>

			<p className="recipe-list-count">
				{filteredAndSorted.length} recette
				{filteredAndSorted.length > 1 ? "s" : ""}
			</p>

			<div className="recipe-grid">
				{filteredAndSorted.map((recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						isFavorite={favorites.includes(recipe.id)}
						onToggleFavorite={toggleFavorite}
					/>
				))}
			</div>
		</div>
	);
}
