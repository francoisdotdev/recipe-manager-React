import { useState, useEffect } from "react";
import type { Recipe } from "../types/recipes";

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type MealTime = "Lunch" | "Dinner";
export type DishType = "entrée" | "plat" | "dessert";

export type DayPlanning = Record<Day, Record<MealTime, Record<DishType, Recipe | null>>>;

export const DAYS: Day[] = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
export const MEALS: MealTime[] = ["Lunch","Dinner"];
export const DISHTYPES: DishType[] = ["entrée","plat","dessert"];

export function usePlanning() {
  const [planning, setPlanning] = useState<DayPlanning>(() => {
    const saved = localStorage.getItem("planning");
    if (saved) return JSON.parse(saved);

    const init: DayPlanning = {} as DayPlanning;
    DAYS.forEach(day => {
      init[day] = {} as Record<MealTime, Record<DishType, Recipe | null>>;
      MEALS.forEach(meal => {
        init[day][meal] = { entrée: null, plat: null, dessert: null };
      });
    });
    return init;
  });

  useEffect(() => {
    localStorage.setItem("planning", JSON.stringify(planning));
  }, [planning]);

  const addDishToDay = (day: Day, meal: MealTime, type: DishType, dish: Recipe) => {
    setPlanning(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          [type]: dish
        }
      }
    }));
  };

  const removeDishFromDay = (day: Day, meal: MealTime, type: DishType) => {
    setPlanning(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: {
          ...prev[day][meal],
          [type]: null
        }
      }
    }));
  };

  return { planning, addDishToDay, removeDishFromDay, DAYS, MEALS, DISHTYPES };
}
