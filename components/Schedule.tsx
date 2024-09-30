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
  const[nextMonthOfficeDays, setNextMonthOfficeDays] = useState<number | null>(null);

  useEffect(() => {
    getNextFourDays(firstDay).then(setFourDaysSchedule);
  }, [firstDay]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextMonthYear = month === 12 ? year + 1 : year;

    const fetchOfficeDays = async (year: number, month: number, setOfficeDays: (days: number) => void) => {
      const apiUrl = `/api/days/office-days?year=${year}&month=${month}`;
      console.log(`Request URL: ${apiUrl}`);

      try {
        const response = await fetchAPI(apiUrl);
        console.log("API Response: ", response.data);
        setOfficeDays(response.data);
      } catch (error) {
        console.error("Error fetching office days: ", error);
      }
    };

    fetchOfficeDays(year, month, setOfficeDays);
    fetchOfficeDays(nextMonthYear, nextMonth, setNextMonthOfficeDays);
  }, []);

  const setDayInOffice = async (day_: any, formattedDate: string) => {
    if (day_) {
      day_.inOffice = true;
      const response = await fetchAPI(`/api/days/${day_.id}`, "PUT", day_);
      if (response) {
        setDays([
          ...days.filter((day: any) => day.date !== formattedDate),
          response.data,
        ]);
      }
    } else {
      const inOfficePayload = { date: formattedDate, inOffice: true };
      const response = await fetchAPI("/api/days", "POST", inOfficePayload);
      if (response) {
        setDays([...days, response.data]);
      }
    }
  };

  const setDayRemote = async (day_: any, formattedDate: string) => {
    if (day_) {
      day_.inOffice = false;
      const response = await fetchAPI(`/api/days/${day_.id}`, "PUT", day_);
      if (response) {
        setDays([
          ...days.filter((day: any) => day.date !== formattedDate),
          response.data,
        ]);
      }
    } else {
      const inOfficePayload = { date: formattedDate, inOffice: false };
      const response = await fetchAPI("/api/days", "POST", inOfficePayload);
      if (response) {
        setDays([
          ...days.filter((day: any) => day.date !== formattedDate),
          response.data,
        ]);
      }
    }
  };

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
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {officeDays !== null && (
          <p>Office Days this month: {officeDays}</p>
        )}
        {nextMonthOfficeDays !== null && (
          <p>Office Days next month: {nextMonthOfficeDays}</p>
        )}
      </div>
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
              setDayInOffice={() => setDayInOffice(dayFound, day.toISOString().slice(0, 10))}
              setDayRemote={() => setDayRemote(dayFound, day.toISOString().slice(0, 10))}
            />
          );
        })}
      </div>
      <GroceryList groceries={groceries} />
    </div>
  );
};

export default Schedule;
