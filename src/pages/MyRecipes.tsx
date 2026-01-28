import React, { useState, useEffect } from "react";
import { type Recipe, type Ingredient } from "../types/recipes";

const MyRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const stored = localStorage.getItem("recipes");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<Recipe>({
    id: Date.now(),
    name: "",
    type: "",
    cuisine: "",
    difficulty: "",
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    image: "",
    ingredients: [],
    steps: [],
    rating: 0,
  });

  const [ingredientInput, setIngredientInput] = useState<Ingredient>({
    name: "",
    quantity: 0,
    unit: "",
  });

  const [stepInput, setStepInput] = useState("");

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addIngredient = () => {
    if (!ingredientInput.name) return;
    setForm({
      ...form,
      ingredients: [...form.ingredients, { ...ingredientInput }],
    });
    setIngredientInput({ name: "", quantity: 0, unit: "" });
  };

  const addStep = () => {
    if (!stepInput) return;
    setForm({
      ...form,
      steps: [...form.steps, stepInput],
    });
    setStepInput("");
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRecipes([...recipes, { ...form, id: Date.now() }]);
    setForm({
      id: Date.now(),
      name: "",
      type: "",
      cuisine: "",
      difficulty: "",
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      image: "",
      ingredients: [],
      steps: [],
      rating: 0,
    });
    setShowForm(false);
  };

  return (
    <div>
      <h1>My Recipes</h1>
      <button onClick={() => setShowForm(true)}>Add Recipe</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.currentTarget.value })}
            />
          </div>

          <div>
            <label>Type:</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.currentTarget.value })}
            />
          </div>

          <div>
            <label>Cuisine:</label>
            <input
              type="text"
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.currentTarget.value })}
            />
          </div>

          <div>
            <label>Difficulty:</label>
            <input
              type="text"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.currentTarget.value })}
            />
          </div>

          <div>
            <label>Prep Time (min):</label>
            <input
              type="number"
              value={form.prepTime}
              onChange={(e) => setForm({ ...form, prepTime: Number(e.currentTarget.value) })}
            />
          </div>

          <div>
            <label>Cook Time (min):</label>
            <input
              type="number"
              value={form.cookTime}
              onChange={(e) => setForm({ ...form, cookTime: Number(e.currentTarget.value) })}
            />
          </div>

          <div>
            <label>Servings:</label>
            <input
              type="number"
              value={form.servings}
              onChange={(e) => setForm({ ...form, servings: Number(e.currentTarget.value) })}
            />
          </div>

          <div>
            <label>Image URL:</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.currentTarget.value })}
            />
          </div>

          <div>
            <label>Rating:</label>
            <input
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.currentTarget.value) })}
            />
          </div>

          <div>
            <h3>Ingredients</h3>
            <input
              placeholder="Name"
              value={ingredientInput.name}
              onChange={(e) => setIngredientInput({ ...ingredientInput, name: e.currentTarget.value })}
            />
            <input
              placeholder="Quantity"
              type="number"
              value={ingredientInput.quantity}
              onChange={(e) => setIngredientInput({ ...ingredientInput, quantity: Number(e.currentTarget.value) })}
            />
            <input
              placeholder="Unit"
              value={ingredientInput.unit}
              onChange={(e) => setIngredientInput({ ...ingredientInput, unit: e.currentTarget.value })}
            />
            <button type="button" onClick={addIngredient}>Add Ingredient</button>
            <ul>
              {form.ingredients.map((ing, idx) => (
                <li key={idx}>{ing.quantity} {ing.unit} {ing.name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Steps</h3>
            <input
              placeholder="Step"
              value={stepInput}
              onChange={(e) => setStepInput(e.currentTarget.value)}
            />
            <button type="button" onClick={addStep}>Add Step</button>
            <ol>
              {form.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>

          <button type="submit">Save Recipe</button>
        </form>
      )}

      <h2>Saved Recipes</h2>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <h3>{r.name}</h3>
            <p>Type: {r.type}</p>
            <p>Cuisine: {r.cuisine}</p>
            <p>Difficulty: {r.difficulty}</p>
            <p>Prep Time: {r.prepTime} min | Cook Time: {r.cookTime} min</p>
            <p>Servings: {r.servings}</p>
            <p>Rating: {r.rating}</p>
            {r.image && <img src={r.image} alt={r.name} width={150} />}
            <h4>Ingredients:</h4>
            <ul>
              {r.ingredients.map((ing, idx) => (
                <li key={idx}>{ing.quantity} {ing.unit} {ing.name}</li>
              ))}
            </ul>
            <h4>Steps:</h4>
            <ol>
              {r.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyRecipes;
