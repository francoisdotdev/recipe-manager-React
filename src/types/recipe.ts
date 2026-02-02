export interface Ingredient {
    name: string,
    quantity: number,
    unit: string
}

export type RecipeType = 'plat' | 'entrée' | 'dessert'

export type Difficulty = 'Facile' | 'Moyen' | 'Difficile'

export interface PlannedMeal {
    recipeId: number,
    date: string,
    mealType: 'Déjeuner' | 'Diner'
}

export interface ShoppingItem {
    ingredient: Ingredient,
    checked: boolean,
    recipeIds: number[]
}

export interface Recipe {
    id: number,
    name: string,
    type: RecipeType,
    cuisine: string, 
    difficulty: Difficulty,
    prepTime: number,
    cookTime: number,
    servings: number,
    image: string,
    ingredients: Ingredient[],
    steps: string[],
    rating: number
}