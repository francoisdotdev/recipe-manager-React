import { ShoppingItem } from "./shoppingItem";
import type { Ingredient } from "../../types/recipes";

interface ShoppingListProps {
  items: Ingredient[];
}

export function ShoppingList({ items }: ShoppingListProps) {
  if (items.length === 0) return <p>Votre planning est vide !</p>;

  return (
    <ul>
      {items.map((ing, idx) => (
        <ShoppingItem key={idx} ingredient={ing} />
      ))}
    </ul>
  );
}
