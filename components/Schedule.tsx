import { useEffect, useState } from "react";
import getNextFourDays from "../utils/nextFourDays";
import { fetchAPI, formatDate, formatISODate } from "@/app/utils";
import {
  setFourDaysScheduleDisplay,
  useScheduleState,
} from "@/hooks/useScheduleHooks";
import GroceryList from "./GroceryList";
import DaySchedule from "./DaySchedule";

const Schedule = () => {
  const {
    mealsSchedule,
    setMealsSchedule,
    groceries,
    setGroceries,
    fourDaysSchedule,
    setFourDaysSchedule,
    meals,
    setMeals,
    addMealsIndexes,
    setAddMealsIndexes,
  } = useScheduleState();

  useEffect(() => {
    getNextFourDays().then(setFourDaysSchedule);
  }, []);

  setFourDaysScheduleDisplay(
    fourDaysSchedule,
    setMeals,
    setMealsSchedule,
    setGroceries
  );

  const addMealToSchedule = async (meal: any, date: Date) => {
    const formattedDate = formatISODate(date);
    const mealPayload = { meal: meal, scheduledTime: formattedDate };
    const response = await fetchAPI("/api/meal-schedules", "POST", mealPayload);
    if (response) {
      setMealsSchedule([...mealsSchedule, response.data]);
      const startDate = formatISODate(fourDaysSchedule[0]);
      const endDate = formatISODate(
        fourDaysSchedule[fourDaysSchedule.length - 1]
      );
      const groceriesUpdate = await fetchAPI(
        `/api/meal-schedule/get-groceries?startDate=${startDate}&endDate=${endDate}`
      );
      setGroceries(groceriesUpdate.data);
    }
  };

  const showAddMeal = (index: number): void => {
    setAddMealsIndexes((prevIndexes: any) => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter((idx: any) => idx !== index);
      } else {
        return [...prevIndexes, index];
      }
    });
  };

  const deleteScheduledMeal = async (mealSched: any) => {
    const response = await fetchAPI(
      `/api/meal-schedules/${mealSched}`,
      "DELETE"
    );
    if (response) {
      setMealsSchedule(
        mealsSchedule.filter((meal: any) => meal.scheduleId !== mealSched)
      );
      const startDate = formatISODate(fourDaysSchedule[0]);
      const endDate = formatISODate(
        fourDaysSchedule[fourDaysSchedule.length - 1]
      );
      const groceriesUpdate = await fetchAPI(
        `/api/meal-schedule/get-groceries?startDate=${startDate}&endDate=${endDate}`
      );
      setGroceries(groceriesUpdate.data);
    }
  };

  return (
    <div className="md:h-[70vh] w-full p-4 rounded-lg mt-5">
      <div className="flex flex-col md:flex-row h-full md:space-x-4">
        {fourDaysSchedule.map((day: any, index: any) => (
          <DaySchedule 
            key={index} 
            day={day} 
            mealsSchedule={mealsSchedule} 
            deleteScheduledMeal={deleteScheduledMeal} 
            addMealToSchedule={addMealToSchedule} 
            showAddMeal={showAddMeal} 
            addMealsIndexes={addMealsIndexes} 
            meals={meals} 
            index={index}
            />
        ))}
      </div>
      <GroceryList groceries={groceries} />
    </div>
  );
};

export default Schedule;
