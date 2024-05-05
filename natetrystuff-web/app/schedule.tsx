import { get } from "http";
import { useEffect, useState } from "react";

const Schedule = () => {

    const getNextFourDays = () => {
        const today = new Date()
        const fourDays = []
        for (let i = 0; i < 4; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() + i)
            fourDays.push(date)
        }
        return fourDays
    }
    const [mealsSchedule, setMealsSchedule] = useState([]) // [ {date: Date, meals: [ {mealName: string, ingredients: [string]} ] }
    const getMealSchedules = async () => {
        const response = await fetch('/api/meal-schedules')
        const data = (await response.json()).data
        setMealsSchedule(data)
    }

    const [fourDaysSchedule, setFourDaysSchedule] = useState(getNextFourDays())
    const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false)
    const [meals, setMeals] = useState([])
    const getMeals = async () => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        setMeals(data);
    }

    const addMealToSchedule = async (meal:any, date:any) => { 
        console.log(date)
        meal = {meal: meal, scheduledTime: date}
        const mealz = JSON.stringify(meal)
        const response = await fetch('/api/meal-schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: mealz,
        });
        const data = await response.json();
    }

    useEffect(() => {
        getMealSchedules()
        getMeals()
    }
    , []);

    const[addMealsIndexes, setAddMealsIndexes] = useState<any>([]) 

    console.log(addMealsIndexes)
    const showAddMeal = (index: number) => {
        setIsAddMealFormVisible(prevVisible => !prevVisible);  // Toggles visibility state
    
        setAddMealsIndexes((prevIndexes:any) => {
            if (prevIndexes.includes(index)) {
                // If the index is already included, remove it
                return prevIndexes.filter((idx: any) => idx !== index);
            } else {
                // Otherwise, add this index to the array
                return [...prevIndexes, index];
            }
        });
    }
    

    return (
        <div className="h-[70vh] border-2 border-white w-full">
            
            {/* show the next 4 days that take the full vertical, and each takes 1/4 of the width */}
            <div className="flex flex-row h-full">
    {fourDaysSchedule.map((day, index) => (
        <div key={index} className="w-1/4 flex flex-col">
            <h1>{day.toDateString()}</h1>
            <div className="bg-green-500 flex flex-col flex-grow">
                {
                   mealsSchedule?.filter(
                        (mealSched:any) => {
                            const mealDate = new Date(mealSched.scheduledTime);
                            return mealDate.toDateString() === day.toDateString();
                        }
                    ).length > 0 ? (
                        <ul className="m-2 border-red-100 border-2">
                        {mealsSchedule?.filter(
                            (mealSched:any) => {
                                const mealDate = new Date(mealSched.scheduledTime);
                                return mealDate.toDateString() === day.toDateString();
                            }
                        ).map((mealSched:any, idx) => (
                            <li key={idx}>{mealSched.meal.mealName}</li>
                        ))}
                    </ul>
                    ) : <></>
                }

                <button onClick={() => showAddMeal(index)}>
                    Add Meal to Schedule
                </button>
                {addMealsIndexes.includes(index) && (
                    <ul>
                        {meals.map((meal:any, idx) => (
                            <li className="m-2 text-sm bg-yellow-500"  key={idx} onClick={() => addMealToSchedule(meal, day)}>{meal.mealName}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    ))}
</div>

        </div>
    );
}

export default Schedule;