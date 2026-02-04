import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { PlannedMeal, Recipe } from "../../types/recipe";
import recipesData from "../../data/recipes.json";

const allRecipesData = recipesData as Recipe[];

const DAYS = [
	"Lundi",
	"Mardi",
	"Mercredi",
	"Jeudi",
	"Vendredi",
	"Samedi",
	"Dimanche",
];
const MEALS = ["Déjeuner", "Diner"] as const;

export function WeekPlanning() {
	const [planning, setPlanning] = useLocalStorage<PlannedMeal[]>(
		"planning",
		[],
	);
	const [customRecipes] = useLocalStorage<Recipe[]>("myRecipes", []);
	const [selecting, setSelecting] = useState<{
		day: string;
		meal: (typeof MEALS)[number];
	} | null>(null);
	const [search, setSearch] = useState("");

	const allRecipes = [...allRecipesData, ...customRecipes];

	function getRecipeForSlot(day: string, meal: (typeof MEALS)[number]) {
		const entry = planning.find((p) => p.date === day && p.mealType === meal);
		if (!entry) return null;
		return allRecipes.find((r) => r.id === entry.recipeId) || null;
	}

	function assignRecipe(recipeId: number) {
		if (!selecting) return;
		setPlanning((prev) => {
			const filtered = prev.filter(
				(p) => !(p.date === selecting.day && p.mealType === selecting.meal),
			);
			return [
				...filtered,
				{ recipeId, date: selecting.day, mealType: selecting.meal },
			];
		});
		setSelecting(null);
		setSearch("");
	}

	function removeRecipe(day: string, meal: (typeof MEALS)[number]) {
		setPlanning((prev) =>
			prev.filter((p) => !(p.date === day && p.mealType === meal)),
		);
	}

	function clearPlanning() {
		setPlanning([]);
	}

	const filteredRecipes = allRecipes.filter((r) =>
		r.name.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="planning">
			<div className="planning-header">
				<h1 className="page-title">Planning de la semaine</h1>
				{planning.length > 0 && (
					<button
						type="button"
						className="btn btn-danger"
						onClick={clearPlanning}
					>
						<Trash2 className="icon-xs" /> Réinitialiser
					</button>
				)}
			</div>

			<div className="planning-grid-wrapper">
				<div className="planning-grid">
					<div className="planning-corner" />
					{DAYS.map((day) => (
						<div key={day} className="planning-day-header">
							{day}
						</div>
					))}

					{MEALS.map((meal) => (
						<div key={meal} className="planning-meal-row">
							<div className="planning-meal-label">{meal}</div>
							{DAYS.map((day) => {
								const recipe = getRecipeForSlot(day, meal);
								return (
									<div
										key={`${day}-${meal}`}
										className="planning-slot"
										onClick={() => setSelecting({ day, meal })}
										onKeyDown={(e) => {
											if (e.key === "Enter") setSelecting({ day, meal });
										}}
										role="button"
										tabIndex={0}
									>
										{recipe ? (
											<div className="planning-slot-content">
												<p className="planning-slot-name">{recipe.name}</p>
												<p className="planning-slot-time">
													{recipe.prepTime + recipe.cookTime} min
												</p>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														removeRecipe(day, meal);
													}}
													className="planning-slot-remove"
												>
													<X className="icon-xs" />
												</button>
											</div>
										) : (
											<span className="planning-slot-empty">
												<Plus className="icon-sm" />
											</span>
										)}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>

			{selecting && (
				<div
					className="modal-overlay"
					onClick={() => {
						setSelecting(null);
						setSearch("");
					}}
					onKeyDown={(e) => {
						if (e.key === "Escape") {
							setSelecting(null);
							setSearch("");
						}
					}}
					role="button"
					tabIndex={0}
				>
					<div
						className="modal"
						onClick={(e) => e.stopPropagation()}
						onKeyDown={() => {}}
						role="dialog"
					>
						<h2 className="modal-title">
							{selecting.day} – {selecting.meal}
						</h2>
						<input
							className="form-input"
							placeholder="Rechercher une recette..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<div className="modal-list">
							{filteredRecipes.map((r) => (
								<button
									type="button"
									key={r.id}
									onClick={() => assignRecipe(r.id)}
									className="modal-list-item"
								>
									<span className="modal-list-item-name">{r.name}</span>
									<span className="modal-list-item-info">
										{r.type} · {r.difficulty}
									</span>
								</button>
							))}
						</div>
						<button
							type="button"
							onClick={() => {
								setSelecting(null);
								setSearch("");
							}}
							className="btn btn-secondary btn-full"
						>
							Annuler
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
