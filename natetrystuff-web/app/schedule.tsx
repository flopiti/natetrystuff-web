import { useEffect, useState } from 'react';

const Schedule = () => {
    const getNextFourDays = (): any[] => {
        const today = new Date();
        const fourDays: any[] = [];
        for (let i = 0; i < 4; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
            date.setHours(0, 0, 0, 0);
            fourDays.push(date);
        }
        return fourDays;
    };

    const [mealsSchedule, setMealsSchedule] = useState<any[]>([]); 

    const getMealSchedules = async (): Promise<void> => {
        const response = await fetch('/api/meal-schedules');
        const data = (await response.json()).data;
        setMealsSchedule(data);
    };

    const [fourDaysSchedule, setFourDaysSchedule] = useState<any[]>(getNextFourDays());
    const [isAddMealFormVisible, setIsAddMealFormVisible] = useState<boolean>(false);
    const [meals, setMeals] = useState<any[]>([]);

    const getMeals = async (): Promise<void> => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        setMeals(data);
    };

    const formatISODate = (date: Date): string => {
        return `${date.toISOString().split('T')[0]}T00:00:00`; // Returns 'YYYY-MM-DDT00:00:00'
    };
    
    const setToMidnight = (date: Date): void => {
        date.setHours(0, 0, 0, 0);
    };

    const addMealToSchedule = async (meal: any, date: Date): Promise<void> => {
        setToMidnight(date); // Ensure the meal is scheduled at midnight
        const formattedDate = formatISODate(date);
        meal = { meal: meal, scheduledTime: formattedDate };
        const mealz = JSON.stringify(meal);
        const response = await fetch('/api/meal-schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: mealz,
        });
        const data = await response.json();
        setMealsSchedule([...mealsSchedule, data.data]);
    };

    useEffect(() => {
        getMealSchedules();
        getMeals();
    }, []);

    const [addMealsIndexes, setAddMealsIndexes] = useState<any[]>([]);

    const showAddMeal = (index: number): void => {
        setIsAddMealFormVisible(prevVisible => !prevVisible);  // Toggles visibility state
    
        setAddMealsIndexes((prevIndexes: any) => {
            if (prevIndexes.includes(index)) {
                // If the index is already included, remove it
                return prevIndexes.filter((idx: any) => idx !== index);
            } else {
                // Otherwise, add this index to the array
                return [...prevIndexes, index];
            }
        });
    };

    const deleteScheduledMeal = async (mealSched: any): Promise<void> => {
        const response = await fetch(`/api/meal-schedules/${mealSched}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        setMealsSchedule(mealsSchedule.filter((meal: any) => meal.scheduleId !== mealSched));
    };

    return (
        <div className='h-[70vh] border-2 border-white w-full'>
            <div className='flex flex-row h-full'>
                {fourDaysSchedule.map((day, index) => (
                    <div key={index} className='w-1/4 flex flex-col'>
                        <h1>{day.toLocaleDateString()}</h1>
                        <div className='bg-green-500 flex flex-col flex-grow'>
                            {mealsSchedule.filter((mealSched: any) => {
                                const mealDate = new Date(mealSched.scheduledTime);
                                return mealDate.toLocaleDateString() === day.toLocaleDateString();
                            }).length > 0 ? (
                                <ul className='m-2 border-red-100 border-2'>
                                    {mealsSchedule.filter((mealSched: any) => {
                                        const mealDate = new Date(mealSched.scheduledTime);
                                        return mealDate.toLocaleDateString() === day.toLocaleDateString();
                                    }).map((mealSched: any, idx: any) => (
                                        <li key={idx}><span>{mealSched.meal.mealName}</span><button className='mx-2' onClick={() => deleteScheduledMeal(mealSched.scheduleId)}>X</button></li>
                                    ))}
                                </ul> 
                            ) : <></>}
                            <button onClick={() => showAddMeal(index)}>
                                Add Meal to Schedule
                            </button>
                            {addMealsIndexes.includes(index) && (
                                <ul>
                                    {meals.map((meal: any, idx: any) => (
                                        <li className='m-2 text-sm bg-yellow-500' key={idx} onClick={() => addMealToSchedule(meal, day)}>{meal.mealName}</li>  
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Schedule;