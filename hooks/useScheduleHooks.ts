import { useEffect, useState } from 'react';
import { MealSchedule, Grocery, Meal } from '@/types/types';
import { fetchAPI, formatISODate } from '@/app/utils';

export const useScheduleState = () => {
    const [mealsSchedule, setMealsSchedule] = useState<MealSchedule[]>([]);
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [fourDaysSchedule, setFourDaysSchedule] = useState<Date[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [days, setDays] = useState<any[]>([]);

    return { mealsSchedule, setMealsSchedule, groceries, setGroceries, fourDaysSchedule, setFourDaysSchedule, meals, setMeals , days, setDays };
};

export const setFourDaysScheduleDisplay = (fourDaysSchedule:any, setMeals:any, setMealsSchedule:any, setGroceries:any, setInOfficeDays:any) => {
    useEffect(() => {
        const fetchInitialData = async () => {
            if (fourDaysSchedule.length === 0) return;
            const startDate = formatISODate(fourDaysSchedule[0]);
            const endDate = formatISODate(fourDaysSchedule.at(-1));
            const [mealsData, mealSchedulesData, groceriesData, inOfficeDays] = await Promise.all([
                fetchAPI('/api/meals'),
                fetchAPI(`/api/meal-schedules?startDate=${startDate}&endDate=${endDate}`),
                fetchAPI(`/api/meal-schedule/get-groceries?startDate=${startDate}&endDate=${endDate}`),
                fetchAPI('/api/days')
            ]);
            setMeals(mealsData.data);
            setMealsSchedule(mealSchedulesData.data);
            setGroceries(groceriesData.data);
            setInOfficeDays(inOfficeDays.data);
            console.log(mealSchedulesData.data); // Log meals schedule when received from hook
        };
        fetchInitialData();
    }, [fourDaysSchedule]);
};