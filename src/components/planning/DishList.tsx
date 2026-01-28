import type { Recipe } from "../../types/recipes";

interface DishListProps {
  dishes: Recipe[];
  onDragStart: (dish: Recipe) => void;
}

export function DishList({ dishes, onDragStart }: DishListProps) {
  const types: string[] = ["entrée", "plat", "dessert"];

  return (
    <div>
      {types.map(type => (
        <div key={type} style={{ marginBottom: 16 }}>
          <h4>{type.toUpperCase()}</h4>
          <ul>
            {dishes.filter(d => d.type === type).map(dish => (
              <li
                key={dish.id}
                draggable
                onDragStart={() => onDragStart(dish)}
                style={{ cursor: "grab", margin: 4, border: "1px solid gray", padding: 4 }}
              >
                {dish.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
