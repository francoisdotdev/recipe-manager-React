import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
  Link,
  createHashHistory,
} from '@tanstack/react-router'
import { useState } from 'react'
import { ChefHat } from 'lucide-react'
import { RecipeList } from './components/recipe/RecipeList'
import { RecipeDetail } from './components/recipe/RecipeDetail'
import { RecipeForm } from './components/recipe/RecipeForm'
import { WeekPlanning } from './components/planning/WeekPlanning'
import { ShoppingList } from './components/shopping/ShoppingList'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Recipe } from './types/recipe'

const rootRoute = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <ChefHat className="icon-sm" /> Recettes
          </Link>
          {[
            { to: '/' as const, label: 'Catalogue' },
            { to: '/mes-recettes' as const, label: 'Mes recettes' },
            { to: '/planning' as const, label: 'Planning' },
            { to: '/shopping' as const, label: 'Courses' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="navbar-link">
              {label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function HomePage() {
    return (
      <div>
        <h1 className="page-title">Toutes les recettes</h1>
        <RecipeList />
      </div>
    )
  },
})

const recipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recipe/$recipeId',
  component: function RecipePage() {
    const { recipeId } = recipeRoute.useParams()
    return <RecipeDetail recipeId={Number(recipeId)} />
  },
})

const myRecipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mes-recettes',
  component: function MyRecipesPage() {
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
  },
})

const planningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planning',
  component: function PlanningPage() {
    return <WeekPlanning />
  },
})

const shoppingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shopping',
  component: function ShoppingPage() {
    return <ShoppingList />
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  recipeRoute,
  myRecipesRoute,
  planningRoute,
  shoppingRoute,
])

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
