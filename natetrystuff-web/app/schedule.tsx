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

    console.log(mealsSchedule)
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


    return (
        <div className="h-[70vh] border-2 border-white w-full">
            
            {/* show the next 4 days that take the full vertical, and each takes 1/4 of the width */}
            <div className="flex flex-row">
                {fourDaysSchedule.map((day, index) => {
                    return (
                        <div key={index} className="w-1/4">
                            <h1>{day.toDateString()}</h1>
                            <ul>
                                {mealsSchedule?.filter(
                                    (mealSched:any) => {
                                        const mealDate = new Date(mealSched.scheduledTime)
                                        return mealDate.toDateString() === day.toDateString()
                                    }
                                
                                ).map((mealSched:any, index: number) => {
                                    return <li key={index}>{mealSched.meal.mealName}</li>
                                })}
                            </ul>
                            
                            <button onClick={()=> setIsAddMealFormVisible(!isAddMealFormVisible)}>
                                Add Meal to Schedule
                            </button>
                            {isAddMealFormVisible && (
                        
                                <ul>
                                    {
                                        meals.map((meal:any, index: number) => {
                                            return <li key={index} onClick={()=>addMealToSchedule(meal, day)} >{meal.mealName}</li>
                                        })
                                    }
                                </ul>
                            )
                            }
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Schedule;