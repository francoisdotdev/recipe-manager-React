import { Link } from "@tanstack/react-router";
import { Heart, Clock, Users, Star } from "lucide-react";
import type { Recipe } from "../../types/recipe";

interface RecipeCardProps {
	recipe: Recipe;
	isFavorite: boolean;
	onToggleFavorite: (id: number) => void;
}

export function RecipeCard({
	recipe,
	isFavorite,
	onToggleFavorite,
}: RecipeCardProps) {
	const totalTime = recipe.prepTime + recipe.cookTime;

	return (
		<div className="recipe-card">
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onToggleFavorite(recipe.id);
				}}
				className={`favorite-btn ${isFavorite ? "is-active" : ""}`}
			>
				<Heart className={`icon-sm ${isFavorite ? "icon-filled" : ""}`} />
			</button>
			<Link
				to="/recipe/$recipeId"
				params={{ recipeId: String(recipe.id) }}
				className="recipe-card-link"
			>
				<img
					src={recipe.image || "https://placehold.co/600x400/FFEDD5/C2410C"}
					alt={recipe.name}
					className="recipe-card-image"
				/>
				<div className="recipe-card-body">
					<div className="recipe-card-tags">
						<span className="tag tag-type">{recipe.type}</span>
						<span className="tag tag-cuisine">{recipe.cuisine}</span>
					</div>
					<h3 className="recipe-card-title">{recipe.name}</h3>
					<div className="recipe-card-meta">
						<span className="meta-item">
							<Clock className="icon-xs" />
							{totalTime} min
						</span>
						<span className="meta-item">
							<Users className="icon-xs" />
							{recipe.servings} pers.
						</span>
						<span className="meta-item">
							<Star className="icon-xs" />
							{recipe.rating}/5
						</span>
					</div>
					<span
						className={`tag tag-difficulty tag-${recipe.difficulty.toLowerCase()}`}
					>
						{recipe.difficulty}
					</span>
				</div>
			</Link>
		</div>
	);
}
