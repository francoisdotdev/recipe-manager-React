import { useMemo } from "react";
import type { Ingredient} from "../types/recipes";
import { usePlanning } from "./usePlanning";
import type { DishType } from "./usePlanning";

function mergeIngredients(ingredients: Ingredient[]): Ingredient[] {
  const map = new Map<string, Ingredient>();
  for (const ing of ingredients) {
    const key = `${ing.name}-${ing.unit}`;
    if (map.has(key)) {
      map.get(key)!.quantity += ing.quantity;
    } else {
      map.set(key, { ...ing });
    }
  }
  return Array.from(map.values());
}

export function useShoppingList() {
  const { planning } = usePlanning();

  const shoppingList = useMemo(() => {
    const allIngredients: Ingredient[] = [];

    Object.values(planning).forEach(dayMeals => {
      Object.values(dayMeals).forEach(meal => {
        (["entrée", "plat", "dessert"] as DishType[]).forEach(type => {
          const dish = meal[type];
          if (dish) allIngredients.push(...dish.ingredients);
        });
      });
    });

    return mergeIngredients(allIngredients).sort((a, b) => a.name.localeCompare(b.name));
  }, [planning]);

  return shoppingList;
}
