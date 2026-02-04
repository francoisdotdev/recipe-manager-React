import { useState } from "react";
import type { Recipe, RecipeType, Difficulty } from "../../types/recipe";

interface RecipeFormProps {
	onSubmit: (recipe: Recipe) => void;
	onCancel: () => void;
}

export function RecipeForm({ onSubmit, onCancel }: RecipeFormProps) {
	const [name, setName] = useState("");
	const [type, setType] = useState<RecipeType>("plat");
	const [cuisine, setCuisine] = useState("");
	const [difficulty, setDifficulty] = useState<Difficulty>("Facile");
	const [prepTime, setPrepTime] = useState(15);
	const [cookTime, setCookTime] = useState(15);
	const [servings, setServings] = useState(4);
	const [ingredientLines, setIngredientLines] = useState("");
	const [stepsText, setStepsText] = useState("");

	function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!name.trim()) return;

		const ingredients = ingredientLines
			.split("\n")
			.filter((l) => l.trim())
			.map((line) => {
				const parts = line.trim().split(/\s+/);
				const quantity = parseFloat(parts[0]) || 1;
				const unit = parts[1] || "";
				const ingredientName =
					parts.slice(2).join(" ") || parts.slice(1).join(" ");
				return { quantity, unit, name: ingredientName };
			});

		const steps = stepsText
			.split("\n")
			.filter((l) => l.trim())
			.map((l) => l.trim());

		const recipe: Recipe = {
			id: Date.now(),
			name: name.trim(),
			type,
			cuisine: cuisine.trim() || "Maison",
			difficulty,
			prepTime,
			cookTime,
			servings,
			image: "",
			ingredients,
			steps,
			rating: 0,
		};

		onSubmit(recipe);
	}

	return (
		<form onSubmit={handleSubmit} className="recipe-form">
			<h2 className="recipe-form-title">Nouvelle recette</h2>

			<div className="form-field">
				<label className="form-label">Nom *</label>
				<input
					className="form-input"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>

			<div className="form-row form-row-2">
				<div className="form-field">
					<label className="form-label">Type</label>
					<select
						className="form-input"
						value={type}
						onChange={(e) => setType(e.target.value as RecipeType)}
					>
						<option value="entrée">Entrée</option>
						<option value="plat">Plat</option>
						<option value="dessert">Dessert</option>
					</select>
				</div>
				<div className="form-field">
					<label className="form-label">Difficulté</label>
					<select
						className="form-input"
						value={difficulty}
						onChange={(e) => setDifficulty(e.target.value as Difficulty)}
					>
						<option value="Facile">Facile</option>
						<option value="Moyen">Moyen</option>
						<option value="Difficile">Difficile</option>
					</select>
				</div>
			</div>

			<div className="form-field">
				<label className="form-label">Cuisine</label>
				<input
					className="form-input"
					value={cuisine}
					onChange={(e) => setCuisine(e.target.value)}
					placeholder="Française, Italienne..."
				/>
			</div>

			<div className="form-row form-row-3">
				<div className="form-field">
					<label className="form-label">Préparation (min)</label>
					<input
						className="form-input"
						type="number"
						min={0}
						value={prepTime}
						onChange={(e) => setPrepTime(Number(e.target.value))}
					/>
				</div>
				<div className="form-field">
					<label className="form-label">Cuisson (min)</label>
					<input
						className="form-input"
						type="number"
						min={0}
						value={cookTime}
						onChange={(e) => setCookTime(Number(e.target.value))}
					/>
				</div>
				<div className="form-field">
					<label className="form-label">Personnes</label>
					<input
						className="form-input"
						type="number"
						min={1}
						value={servings}
						onChange={(e) => setServings(Number(e.target.value))}
					/>
				</div>
			</div>

			<div className="form-field">
				<label className="form-label">
					Ingrédients (un par ligne : quantité unité nom)
				</label>
				<textarea
					className="form-input form-textarea"
					value={ingredientLines}
					onChange={(e) => setIngredientLines(e.target.value)}
					placeholder={"200 g farine\n3 _ oeufs\n100 ml lait"}
				/>
			</div>

			<div className="form-field">
				<label className="form-label">Étapes (une par ligne)</label>
				<textarea
					className="form-input form-textarea"
					value={stepsText}
					onChange={(e) => setStepsText(e.target.value)}
					placeholder={
						"Préchauffer le four à 180°C\nMélanger les ingrédients..."
					}
				/>
			</div>

			<div className="form-actions">
				<button type="submit" className="btn btn-primary">
					Ajouter
				</button>
				<button type="button" onClick={onCancel} className="btn btn-secondary">
					Annuler
				</button>
			</div>
		</form>
	);
}
