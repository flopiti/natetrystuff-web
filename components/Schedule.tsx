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
    days,
    setDays,
  } = useScheduleState();

  const[firstDay, setFirstDay] = useState(new Date());
  const[officeDays, setOfficeDays] = useState<number | null>(null);

  useEffect(() => {
    getNextFourDays(firstDay).then(setFourDaysSchedule);
  }, [firstDay]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const apiUrl = `/api/days/office-days?year=${year}&month=${month}`;
    console.log(`Request URL: ${apiUrl}`);

    fetchAPI(apiUrl)
      .then((response) => {
        console.log("API Response: ", response.data);
        setOfficeDays(response.data);
      })
      .catch((error) => {
        console.error("Error fetching office days: ", error);
      });
  }, []);

  const showNextDay = () => {
    setFirstDay(new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() + 1));
  };

  const showPreviousDay = () => {
    setFirstDay(new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - 1));
  };

  setFourDaysScheduleDisplay(
    fourDaysSchedule,
    setMeals,
    setMealsSchedule,
    setGroceries,
    setDays
  );

  const addMealToSchedule = async (meal: any, date: Date, occasion: string) => {
    const formattedDate = formatISODate(date);
    const mealPayload = {
      meal: meal,
      scheduledTime: formattedDate,
      occasion: occasion,
    };
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
      <button onClick={showPreviousDay}>Previous</button>
      <button onClick={showNextDay}>Next</button>
      <div className="flex flex-col md:flex-row h-full md:space-x-4">
        {fourDaysSchedule.map((day: any, index: any) => {
          const dayFound = days.find(
            (dayx) => dayx.date === day.toISOString().slice(0, 10)
          );
          return (
            <DaySchedule
              day={day}
              day_={dayFound}
              days={days}
              setDays={setDays}
              mealsSchedule={mealsSchedule}
              deleteScheduledMeal={deleteScheduledMeal}
              addMealToSchedule={addMealToSchedule}
              meals={meals}
              key={index}
              setMealsSchedule={setMealsSchedule}
            />
          );
        })}
      </div>
      <GroceryList groceries={groceries} />
      <div>
        {officeDays !== null && (
          <p>Office Days this month: {officeDays}</p>
        )}
      </div>
    </div>
  );
};

export default Schedule;
