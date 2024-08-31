import { useState, useEffect } from 'react';
import { fetchAPI, formatISODate } from '@/app/utils';
import { MealSchedule, Grocery, Meal } from '@/types/types';

export const useScheduleState = () => {
    const [mealsSchedule, setMealsSchedule] = useState<MealSchedule[]>([]);
    const [groceries, setGroceries] = useState<Grocery[]>([]);
    const [fourDaysSchedule, setFourDaysSchedule] = useState<Date[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [addMealsIndexes, setAddMealsIndexes] = useState<number[]>([]);

    return { mealsSchedule, setMealsSchedule, groceries, setGroceries, fourDaysSchedule, setFourDaysSchedule, meals, setMeals, addMealsIndexes, setAddMealsIndexes };
};

export const useFetchInitialData = (
    fourDaysSchedule: Date[],
    setMeals: React.Dispatch<React.SetStateAction<Meal[]>>,
    setMealsSchedule: React.Dispatch<React.SetStateAction<MealSchedule[]>>,
    setGroceries: React.Dispatch<React.SetStateAction<Grocery[]>>
) => {
    useEffect(() => {
        const fetchInitialData = async () => {
            if (fourDaysSchedule.length === 0) return;
            const [mealsData, mealSchedulesData, groceriesData] = await Promise.all([
                fetchAPI('/api/meals'),
                fetchAPI('/api/meal-schedules'),
                fetchAPI(`/api/meal-schedule/get-groceries?startDate=${formatISODate(fourDaysSchedule[0])}&endDate=${formatISODate(fourDaysSchedule[fourDaysSchedule.length - 1])}`)
            ]);
            setMeals(mealsData.data);
            setMealsSchedule(mealSchedulesData.data);
            setGroceries(groceriesData.data);
        };
        fetchInitialData();
    }, [fourDaysSchedule]);
};