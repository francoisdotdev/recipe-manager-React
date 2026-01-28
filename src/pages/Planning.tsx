import { usePlanning, DISHTYPES } from "../hooks/usePlanning";
import { Calendar } from "../components/planning/Calendar";
import recipesData from "../data/recipes.json";
import type { Recipe } from "../types/recipes";
import { useEffect, useState } from "react";

export default function Planning() {
  const { planning, addDishToDay, removeDishFromDay, DAYS } = usePlanning();

  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recipes");
    if (saved) setMyRecipes(JSON.parse(saved));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Weekly Planning</h1>

      <Calendar
        dishes={[...recipesData, ...myRecipes]}
        planning={planning}
        days={DAYS}
        addDishToDay={addDishToDay}
        removeDishFromDay={removeDishFromDay}
      />

      <h2 style={{ marginTop: 32 }}>All Dishes</h2>

      {DISHTYPES.map(type => (
        <div key={type}>
          <h3>{type}</h3>
          <ul style={{ display: "flex", gap: 8, flexWrap: "wrap", listStyle: "none" }}>
            {recipesData
              .filter(d => d.type === type)
              .map(dish => (
                <li
                  key={dish.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("dish", JSON.stringify(dish))
                  }
                  style={{
                  border: "1px solid gray",
                  padding: 6,
                  cursor: "grab",
                  minWidth: 100,
                  textAlign: "center"
                }}
                >
                  {dish.name}
                </li>
              ))}
          </ul>
        </div>
      ))}

      <div>
        <h3>My Recipes</h3>
        <ul style={{ display: "flex", gap: 8, flexWrap: "wrap", listStyle: "none" }}>
          {myRecipes.map(dish => (
            <li
              key={dish.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("dish", JSON.stringify(dish))
              }
              style={{ border: "1px solid gray", padding: 4 }}
            >
              {dish.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
