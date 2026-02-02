import { Check } from 'lucide-react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { PlannedMeal, Recipe } from '../../types/recipe'
import recipesData from '../../data/recipes.json'

const allRecipesData = recipesData as Recipe[]

interface AggregatedItem {
  name: string
  unit: string
  quantity: number
  checked: boolean
}

export function ShoppingList() {
  const [planning] = useLocalStorage<PlannedMeal[]>('planning', [])
  const [customRecipes] = useLocalStorage<Recipe[]>('myRecipes', [])
  const [checkedItems, setCheckedItems] = useLocalStorage<Record<string, boolean>>('shoppingChecked', {})

  const allRecipes = [...allRecipesData, ...customRecipes]

  const ingredients: AggregatedItem[] = []
  const map = new Map<string, { quantity: number; unit: string; name: string }>()

  for (const meal of planning) {
    const recipe = allRecipes.find((r) => r.id === meal.recipeId)
    if (!recipe) continue
    for (const ing of recipe.ingredients) {
      const key = `${ing.name.toLowerCase()}|${ing.unit.toLowerCase()}`
      const existing = map.get(key)
      if (existing) {
        existing.quantity += ing.quantity
      } else {
        map.set(key, { quantity: ing.quantity, unit: ing.unit, name: ing.name })
      }
    }
  }

  for (const [key, val] of map) {
    ingredients.push({ ...val, checked: !!checkedItems[key] })
  }

  ingredients.sort((a, b) => a.name.localeCompare(b.name))

  function toggleItem(item: AggregatedItem) {
    const key = `${item.name.toLowerCase()}|${item.unit.toLowerCase()}`
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function clearChecked() {
    setCheckedItems({})
  }

  if (planning.length === 0) {
    return (
      <div className="shopping">
        <h1 className="page-title">Liste de courses</h1>
        <p className="empty-state-text">Ajoutez des recettes au planning pour générer votre liste de courses.</p>
      </div>
    )
  }

  const checkedCount = ingredients.filter((i) => i.checked).length

  return (
    <div className="shopping">
      <div className="shopping-header">
        <h1 className="page-title">Liste de courses</h1>
        <span className="shopping-count">
          {checkedCount}/{ingredients.length} acheté{checkedCount > 1 ? 's' : ''}
        </span>
      </div>

      {checkedCount > 0 && (
        <button onClick={clearChecked} className="shopping-clear-btn">
          Tout décocher
        </button>
      )}

      <ul className="shopping-list">
        {ingredients.map((item) => (
          <li
            key={`${item.name}|${item.unit}`}
            onClick={() => toggleItem(item)}
            className={`shopping-item ${item.checked ? 'is-checked' : ''}`}
          >
            <span className={`shopping-checkbox ${item.checked ? 'is-checked' : ''}`}>
              {item.checked && <Check className="icon-xs" />}
            </span>
            <span className="shopping-item-text">
              <strong>{item.quantity}</strong> {item.unit} {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
