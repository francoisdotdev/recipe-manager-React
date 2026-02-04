import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { RecipeForm } from '../components/recipe/RecipeForm'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Recipe } from '../types/recipe'

export function MyRecipesPage() {
  const [myRecipes, setMyRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])
  const [showForm, setShowForm] = useState(false)

  function addRecipe(recipe: Recipe) {
    setMyRecipes((prev) => [...prev, recipe])
    setShowForm(false)
  }

  function deleteRecipe(id: number) {
    setMyRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="my-recipes">
      <div className="my-recipes-header">
        <h1 className="page-title">Mes recettes</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + Ajouter une recette
          </button>
        )}
      </div>

      {showForm && <RecipeForm onSubmit={addRecipe} onCancel={() => setShowForm(false)} />}

      {myRecipes.length === 0 && !showForm ? (
        <p className="empty-state-text">Vous n'avez pas encore ajouté de recettes.</p>
      ) : (
        <div className="my-recipes-grid">
          {myRecipes.map((recipe) => (
            <div key={recipe.id} className="my-recipes-card">
              <div className="my-recipes-card-tags">
                <span className="tag tag-type">{recipe.type}</span>
                <span className="tag tag-cuisine">{recipe.difficulty}</span>
              </div>
              <Link to="/recipe/$recipeId" params={{ recipeId: String(recipe.id) }} className="my-recipes-card-title">
                {recipe.name}
              </Link>
              <div className="my-recipes-card-footer">
                <span className="my-recipes-card-meta">
                  {recipe.prepTime + recipe.cookTime} min · {recipe.servings} pers.
                </span>
                <button onClick={() => deleteRecipe(recipe.id)} className="my-recipes-delete-btn">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
