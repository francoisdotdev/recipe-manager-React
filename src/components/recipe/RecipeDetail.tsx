import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Clock, Flame, Users, Star, Minus, Plus, CalendarPlus, Check } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import recipesData from '../../data/recipes.json'
import type { Recipe, PlannedMeal } from '../../types/recipe'

const recipes = recipesData as Recipe[]

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MEALS = ['Déjeuner', 'Diner'] as const

interface RecipeDetailProps {
  recipeId: number
}

export function RecipeDetail({ recipeId }: RecipeDetailProps) {
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', [])
  const [customRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])
  const [planning, setPlanning] = useLocalStorage<PlannedMeal[]>('planning', [])
  const [servingsOverride, setServingsOverride] = useState<number | null>(null)
  const [showPlanningModal, setShowPlanningModal] = useState(false)
  const [addedSlot, setAddedSlot] = useState<{ day: string; meal: string } | null>(null)

  const allRecipes = [...recipes, ...customRecipes]
  const recipe = allRecipes.find((r) => r.id === recipeId)
  const isFavorite = favorites.includes(recipeId)

  function toggleFavorite() {
    setFavorites((prev) => isFavorite ? prev.filter((id) => id !== recipeId) : [...prev, recipeId])
  }

  function addToPlanning(day: string, meal: typeof MEALS[number]) {
    setPlanning((prev) => {
      const filtered = prev.filter((p) => !(p.date === day && p.mealType === meal))
      return [...filtered, { recipeId, date: day, mealType: meal }]
    })
    setAddedSlot({ day, meal })
    setTimeout(() => {
      setShowPlanningModal(false)
      setAddedSlot(null)
    }, 800)
  }

  function isSlotOccupied(day: string, meal: string) {
    return planning.some((p) => p.date === day && p.mealType === meal)
  }

  function isCurrentRecipeInSlot(day: string, meal: string) {
    return planning.some((p) => p.date === day && p.mealType === meal && p.recipeId === recipeId)
  }

  if (!recipe) {
    return (
      <div className="empty-state">
        <p>Recette non trouvée</p>
        <Link to="/" className="back-link">← Retour aux recettes</Link>
      </div>
    )
  }

  const servings = servingsOverride ?? recipe.servings
  const ratio = servings / recipe.servings

  function adjustQuantity(qty: number) {
    const adjusted = qty * ratio
    return Number.isInteger(adjusted) ? adjusted : Math.round(adjusted * 100) / 100
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <Link to="/" className="back-link">← Retour aux recettes</Link>
        <div className="recipe-detail-actions">
          <button
            onClick={() => setShowPlanningModal(true)}
            className="btn btn-secondary"
          >
            <CalendarPlus className="icon-sm" /> Ajouter au planning
          </button>
          <button
            onClick={toggleFavorite}
            className={`favorite-btn ${isFavorite ? 'is-active' : ''}`}
          >
            <Heart className={`icon-md ${isFavorite ? 'icon-filled' : ''}`} />
          </button>
        </div>
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
        <span className="meta-item"><Star className="icon-sm" />{recipe.rating}/5</span>
      </div>

      <div className="servings-adjuster">
        <Users className="icon-sm" />
        <button
          className="servings-adjuster-btn"
          onClick={() => setServingsOverride(Math.max(1, servings - 1))}
        >
          <Minus className="icon-xs" />
        </button>
        <span className="servings-adjuster-value">{servings}</span>
        <button
          className="servings-adjuster-btn"
          onClick={() => setServingsOverride(servings + 1)}
        >
          <Plus className="icon-xs" />
        </button>
        <span className="servings-adjuster-label">personnes</span>
        {servingsOverride !== null && servingsOverride !== recipe.servings && (
          <button className="servings-adjuster-reset" onClick={() => setServingsOverride(null)}>
            Réinitialiser
          </button>
        )}
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-detail-ingredients">
          <h2 className="section-title">Ingrédients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <strong>{adjustQuantity(ingredient.quantity)}</strong> {ingredient.unit} {ingredient.name}
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

      {showPlanningModal && (
        <div className="modal-overlay" onClick={() => { setShowPlanningModal(false); setAddedSlot(null) }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Ajouter au planning</h2>
            <p className="modal-subtitle">{recipe.name}</p>
            <div className="planning-picker">
              {DAYS.map((day) => (
                <div key={day} className="planning-picker-day">
                  <span className="planning-picker-day-label">{day}</span>
                  <div className="planning-picker-meals">
                    {MEALS.map((meal) => {
                      const isAdded = addedSlot?.day === day && addedSlot?.meal === meal
                      const isCurrentRecipe = isCurrentRecipeInSlot(day, meal)
                      const isOccupied = isSlotOccupied(day, meal) && !isCurrentRecipe
                      return (
                        <button
                          key={meal}
                          className={`planning-picker-slot ${isAdded ? 'is-added' : ''} ${isCurrentRecipe ? 'is-current' : ''} ${isOccupied ? 'is-occupied' : ''}`}
                          onClick={() => addToPlanning(day, meal)}
                        >
                          {isAdded || isCurrentRecipe ? <Check className="icon-xs" /> : meal}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowPlanningModal(false); setAddedSlot(null) }} className="btn btn-secondary btn-full">
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
