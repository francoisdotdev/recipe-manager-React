import type { Recipe } from "../../types/recipes";
import type { Day, MealTime, DishType } from "../../hooks/usePlanning";

interface DaySlotProps {
  day: Day;
  meal: MealTime;
  planned?: Record<DishType, Recipe | null>; 
  addDish: (day: Day, meal: MealTime, type: DishType, dish: Recipe) => void;
  removeDish: (day: Day, meal: MealTime, type: DishType) => void;
}

export function DaySlot({ day, meal, planned, addDish, removeDish }: DaySlotProps) {

  const safePlanned: Record<DishType, Recipe | null> = planned || { entrée: null, plat: null, dessert: null };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, type: DishType) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("dish");
    if (!data) return;
    const dish: Recipe = JSON.parse(data);
    if (dish.type === type) addDish(day, meal, type, dish);
  };

  return (
    <div style={{ border: "1px solid gray", padding: 8, marginBottom: 8 }}>
      <h4>{meal}</h4>
      {(["entrée","plat","dessert"] as DishType[]).map(type => (
        <div
          key={type}
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={(e) => e.preventDefault()}
          style={{
            minHeight: 40,
            border: "1px dashed gray",
            marginBottom: 4,
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {safePlanned[type]?.name || `Drop ${type}`}
          {safePlanned[type] && (
            <button onClick={() => removeDish(day, meal, type)}>x</button>
          )}
        </div>
      ))}
    </div>
  );
}
