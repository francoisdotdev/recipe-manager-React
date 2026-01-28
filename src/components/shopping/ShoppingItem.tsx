import type { Ingredient } from "../../types/recipes";

interface ShoppingItemProps {
  ingredient: Ingredient;
}

export function ShoppingItem({ ingredient }: ShoppingItemProps) {
  return (
    <li>
      {ingredient.name} — {ingredient.quantity} {ingredient.unit}
    </li>
  );
}
