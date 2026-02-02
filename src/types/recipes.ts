export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  type: string;
  cuisine: string;
  difficulty: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  rating: number;
}