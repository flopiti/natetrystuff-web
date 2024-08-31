

import { useEffect, useState } from 'react';
import getNextFourDays from '../utils/nextFourDays';
import { fetchAPI, formatISODate, setToMidnight } from '@/app/utils';

const Schedule = () => {
    const [mealsSchedule, setMealsSchedule] = useState<any[]>([]); 
    const [groceries, setGroceries] = useState<any[]>([]);
    const [fourDaysSchedule, setFourDaysSchedule] = useState<any[]>([]);
    const [meals, setMeals] = useState<any[]>([]);
    const [addMealsIndexes, setAddMealsIndexes] = useState<any[]>([]);

    useEffect(() => {
        getNextFourDays().then((days) => setFourDaysSchedule(days))
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (fourDaysSchedule.length === 0) return;
            const firstDate = formatISODate(fourDaysSchedule[0]);
            const lastDate = formatISODate(fourDaysSchedule[fourDaysSchedule.length - 1]);
            const mealsData = await fetchAPI('/api/meals');
            const mealSchedulesData = await fetchAPI('/api/meal-schedules');
            const groceriesData = await fetchAPI(`/api/meal-schedule/get-groceries?startDate=${firstDate}&endDate=${lastDate}`);
            setMeals(mealsData.data);
            setMealsSchedule(mealSchedulesData.data);
            setGroceries(groceriesData.data);
        };
        fetchInitialData();
    }, [fourDaysSchedule]);
    
    const addMealToSchedule = async (meal: any, date: Date) => {
        const formattedDate = formatISODate(date);
        const mealPayload = { meal: meal, scheduledTime: formattedDate };
        const response = await fetchAPI('/api/meal-schedules', 'POST', mealPayload);

        if (response.ok) {
            setMealsSchedule([...mealsSchedule, response.data]);
            const startDate = formatISODate(fourDaysSchedule[0]);
            const endDate = formatISODate(fourDaysSchedule[fourDaysSchedule.length - 1]);
            const groceriesUpdate = await fetchAPI(`/api/meal-schedule/get-groceries?startDate=${startDate}&endDate=${endDate}`);
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
        const response = await fetchAPI(`/api/meal-schedules/${mealSched}`, 'DELETE');
        if (response.ok) {
            setMealsSchedule(mealsSchedule.filter((meal) => meal.scheduleId !== mealSched));
            const startDate = formatISODate(fourDaysSchedule[0]);
            const endDate = formatISODate(fourDaysSchedule[fourDaysSchedule.length - 1]);
            const groceriesUpdate = await fetchAPI(`/api/meal-schedule/get-groceries?startDate=${startDate}&endDate=${endDate}`);
            setGroceries(groceriesUpdate.data);
        }
    };

    const formatDate = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <div className='md:h-[70vh] w-full p-4 rounded-lg mt-5'>
            <div className='flex flex-col md:flex-row h-full md:space-x-4'>
                {fourDaysSchedule.map((day, index) => (
                    <div key={index} className='md:w-1/4 w-full flex flex-col bg-[#3B465C] shadow-lg rounded-lg p-3 md:p-0 items-center'>
                        <h1 className='text-xl font-extrabold mb-2 text-gray-800 m-4'>{formatDate(day)}</h1>
                        <div className='flex flex-col items-center flex-grow rounded-lg w-full'>
                            {mealsSchedule.filter((mealSched: any) => {
                                const mealDate = new Date(mealSched.scheduledTime);
                                return mealDate.toLocaleDateString() === day.toLocaleDateString();
                            }).length > 0 ? (
                                <ul className='m-2 rounded-lg'>
                                    {mealsSchedule.filter((mealSched: any) => {
                                        const mealDate = new Date(mealSched.scheduledTime);
                                        return mealDate.toLocaleDateString() === day.toLocaleDateString();
                                    }).map((mealSched: any, idx: any) => (
                                        <li key={idx} className='flex justify-between items-center text-gray-500'>
                                            <span className='font-medium'>{mealSched.meal.mealName}</span>
                                            <button className='bg-red-800 opacity-50 text-white rounded px-2 py-1 m-2' onClick={() => deleteScheduledMeal(mealSched.scheduleId)}>X</button>
                                        </li>
                                    ))}
                                </ul> 
                            ) : <p className='text-gray-500 m-2'>No meals scheduled</p>}
                            <button className= 'text-white mt-2 py-1 px-4 rounded hover:bg-blue-600' onClick={() => showAddMeal(index)}>
                                Add Meal to Schedule
                            </button>
                            {addMealsIndexes.includes(index) && (
                                <ul className='mt-2'>
                                    {meals.map((meal: any, idx: any) => (
                                        <li className='m-2 text-sm bg-yellow-500 p-2 rounded hover:bg-yellow-600 cursor-pointer text-black' key={idx} onClick={() => addMealToSchedule(meal, day)}>{meal.mealName}</li>  
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-4 p-4 bg-yellow-100 rounded-lg shadow-lg'>
                <h2 className='text-xl font-bold mb-2 text-black'>Groceries</h2>
                {groceries.length > 0 ? (
                    <ul>
                        {groceries.map((grocery: any, index: number) => (
                            <li key={index} className='text-gray-700'>
                              <span>{grocery.quantity} {grocery.unit} of {grocery.ingredient.ingredientName}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className='text-gray-500'>No groceries listed</p>}
            </div>
        </div>
    );
};

export default Schedule;