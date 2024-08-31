import { useEffect, useState } from 'react';
import { MealSchedule, Grocery, Meal } from '@/types/types';
import { fetchAPI, formatISODate } from '@/app/utils';

export const useScheduleState = () => {
    const [mealsSchedule, setMealsSchedule] = useState<MealSchedule[]>([]);
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [fourDaysSchedule, setFourDaysSchedule] = useState<Date[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [inOfficeDays, setInOfficeDays] = useState<any[]>([]);

    return { mealsSchedule, setMealsSchedule, groceries, setGroceries, fourDaysSchedule, setFourDaysSchedule, meals, setMeals , inOfficeDays, setInOfficeDays };
};

export const setFourDaysScheduleDisplay = (fourDaysSchedule:any, setMeals:any, setMealsSchedule:any, setGroceries:any, setInOfficeDays:any) => {
    useEffect(() => {
        const fetchInitialData = async () => {
            if (fourDaysSchedule.length === 0) return;
            const [mealsData, mealSchedulesData, groceriesData, inOfficeDays] = await Promise.all([
                fetchAPI('/api/meals'),
                fetchAPI('/api/meal-schedules'),
                fetchAPI(`/api/meal-schedule/get-groceries?startDate=${formatISODate(fourDaysSchedule[0])}&endDate=${formatISODate(fourDaysSchedule.at(-1))}`),
                fetchAPI('/api/days')
            ]);
            setMeals(mealsData.data);
            setMealsSchedule(mealSchedulesData.data);
            setGroceries(groceriesData.data);
            setInOfficeDays(inOfficeDays.data);
        };
        fetchInitialData();
    }, [fourDaysSchedule]);
};