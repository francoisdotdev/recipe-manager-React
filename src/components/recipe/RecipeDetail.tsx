import { Link } from '@tanstack/react-router'
import { Heart, Clock, Flame, Users, Star } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import recipesData from '../../data/recipes.json'
import type { Recipe } from '../../types/recipe'

const recipes = recipesData as Recipe[]

interface RecipeDetailProps {
  recipeId: number
}

export function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', [])
  const [customRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])

  const allRecipes = [...recipes, ...customRecipes]
  const recipe = allRecipes.find((r) => r.id === recipeId)
  const isFavorite = favorites.includes(recipeId)

  function toggleFavorite() {
    setFavorites((prev) => isFavorite ? prev.filter((id) => id !== recipeId) : [...prev, recipeId])
  }

  if (!recipe) {
    return (
      <div className="empty-state">
        <p>Recette non trouvée</p>
        <Link to="/" className="back-link">← Retour aux recettes</Link>
      </div>
    )
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <Link to="/" className="back-link">← Retour aux recettes</Link>
        <button
          onClick={toggleFavorite}
          className={`favorite-btn ${isFavorite ? 'is-active' : ''}`}
        >
          <Heart className={`icon-md ${isFavorite ? 'icon-filled' : ''}`} />
        </button>
      </div>

      <div className="recipe-detail-tags">
        <span className="tag tag-type">{recipe.type}</span>
        <span className="tag tag-cuisine">{recipe.cuisine}</span>
        <span className={`tag tag-difficulty tag-${recipe.difficulty.toLowerCase()}`}>
          {recipe.difficulty}
        </span>
      </div>

      <h1 className="recipe-detail-title">{recipe.name}</h1>

      <div className="recipe-detail-meta">
        <span className="meta-item"><Clock className="icon-sm" />Préparation : {recipe.prepTime} min</span>
        <span className="meta-item"><Flame className="icon-sm" />Cuisson : {recipe.cookTime} min</span>
        <span className="meta-item"><Users className="icon-sm" />{recipe.servings} personnes</span>
        <span className="meta-item"><Star className="icon-sm" />{recipe.rating}/5</span>
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-detail-ingredients">
          <h2 className="section-title">Ingrédients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <strong>{ingredient.quantity}</strong> {ingredient.unit} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="recipe-detail-steps">
          <h2 className="section-title">Étapes</h2>
          <ol className="steps-list">
            {recipe.steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
