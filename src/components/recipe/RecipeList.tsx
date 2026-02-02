import { useState } from 'react'
import { Heart } from 'lucide-react'
import { RecipeCard } from './RecipeCard'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import recipesData from '../../data/recipes.json'
import type { Recipe, RecipeType, Difficulty } from '../../types/recipe'

const recipes = recipesData as Recipe[]

export function RecipeList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<RecipeType | ''>('')
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | ''>('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useLocalStorage<number[]>('favorites', [])
  const [customRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])

  const allRecipes = [...recipes, ...customRecipes]

  const filteredRecipes = allRecipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || recipe.type === typeFilter
    const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter
    const matchesFavorites = !showFavoritesOnly || favorites.includes(recipe.id)
    return matchesSearch && matchesType && matchesDifficulty && matchesFavorites
  })

  function toggleFavorite(id: number) {
    setFavorites((prev) => prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id])
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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as RecipeType | '')} className="filters-select">
          <option value="">Tous les types</option>
          <option value="entrée">Entrées</option>
          <option value="plat">Plats</option>
          <option value="dessert">Desserts</option>
        </select>
        <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | '')} className="filters-select">
          <option value="">Toutes difficultés</option>
          <option value="Facile">Facile</option>
          <option value="Moyen">Moyen</option>
          <option value="Difficile">Difficile</option>
        </select>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`filters-favorites-btn ${showFavoritesOnly ? 'is-active' : ''}`}
        >
          <Heart className={`icon-xs ${showFavoritesOnly ? 'icon-filled' : ''}`} /> Favoris
        </button>
      </div>

      <p className="recipe-list-count">{filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''}</p>

      <div className="recipe-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  )
}
