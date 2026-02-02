import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { PlannedMeal, Recipe } from '../../types/recipe'
import recipesData from '../../data/recipes.json'

const allRecipesData = recipesData as Recipe[]

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const MEALS = ['Déjeuner', 'Diner'] as const

export function WeekPlanning() {
  const [planning, setPlanning] = useLocalStorage<PlannedMeal[]>('planning', [])
  const [customRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])
  const [selecting, setSelecting] = useState<{ day: string; meal: typeof MEALS[number] } | null>(null)
  const [search, setSearch] = useState('')

  const allRecipes = [...allRecipesData, ...customRecipes]

  function getRecipeForSlot(day: string, meal: typeof MEALS[number]) {
    const entry = planning.find((p) => p.date === day && p.mealType === meal)
    if (!entry) return null
    return allRecipes.find((r) => r.id === entry.recipeId) || null
  }

  function assignRecipe(recipeId: number) {
    if (!selecting) return
    setPlanning((prev) => {
      const filtered = prev.filter((p) => !(p.date === selecting.day && p.mealType === selecting.meal))
      return [...filtered, { recipeId, date: selecting.day, mealType: selecting.meal }]
    })
    setSelecting(null)
    setSearch('')
  }

  function removeRecipe(day: string, meal: typeof MEALS[number]) {
    setPlanning((prev) => prev.filter((p) => !(p.date === day && p.mealType === meal)))
  }

  const filteredRecipes = allRecipes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="planning">
      <h1 className="page-title">Planning de la semaine</h1>

      <div className="planning-grid-wrapper">
        <div className="planning-grid">
          <div className="planning-corner" />
          {DAYS.map((day) => (
            <div key={day} className="planning-day-header">{day}</div>
          ))}

          {MEALS.map((meal) => (
            <>
              <div key={meal} className="planning-meal-label">{meal}</div>
              {DAYS.map((day) => {
                const recipe = getRecipeForSlot(day, meal)
                return (
                  <div
                    key={`${day}-${meal}`}
                    className="planning-slot"
                    onClick={() => setSelecting({ day, meal })}
                  >
                    {recipe ? (
                      <div className="planning-slot-content">
                        <p className="planning-slot-name">{recipe.name}</p>
                        <p className="planning-slot-time">{recipe.prepTime + recipe.cookTime} min</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeRecipe(day, meal) }}
                          className="planning-slot-remove"
                        >
                          <X className="icon-xs" />
                        </button>
                      </div>
                    ) : (
                      <span className="planning-slot-empty"><Plus className="icon-sm" /></span>
                    )}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>

      {selecting && (
        <div className="modal-overlay" onClick={() => { setSelecting(null); setSearch('') }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {selecting.day} – {selecting.meal}
            </h2>
            <input
              className="form-input"
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <div className="modal-list">
              {filteredRecipes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => assignRecipe(r.id)}
                  className="modal-list-item"
                >
                  <span className="modal-list-item-name">{r.name}</span>
                  <span className="modal-list-item-info">{r.type} · {r.difficulty}</span>
                </button>
              ))}
            </div>
            <button onClick={() => { setSelecting(null); setSearch('') }} className="btn btn-secondary btn-full">
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
