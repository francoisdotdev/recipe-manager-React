import type { Recipe } from "../../types/recipes";
import { DaySlot } from "./DaySlot";
import type { Day, MealTime, DishType } from "../../hooks/usePlanning";
import { MEALS } from "../../hooks/usePlanning";

interface CalendarProps {
  dishes: Recipe[];
  planning: Record<Day, Record<MealTime, Record<DishType, Recipe | null>>>;
  days: Day[];
  addDishToDay: (day: Day, meal: MealTime, type: DishType, dish: Recipe) => void;
  removeDishFromDay: (day: Day, meal: MealTime, type: DishType) => void;
}

export function Calendar({ planning, days, addDishToDay, removeDishFromDay }: CalendarProps) {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {days.map(day => (
        <div key={day} style={{ minWidth: 200 }}>
          <h3>{day}</h3>
          {MEALS.map(meal => (
            <DaySlot
              key={meal}
              day={day}
              meal={meal}
              planned={planning[day][meal]}
              addDish={addDishToDay}
              removeDish={removeDishFromDay}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
