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

    useEffect(() => {
        getMealSchedules()
    }
    , []);
    console.log(mealsSchedule)
    return (
        <div className="h-[70vh] border-2 border-white w-full">
            
            {/* show the next 4 days that take the full vertical, and each takes 1/4 of the width */}
            <div className="flex flex-row">
                {fourDaysSchedule.map((day, index) => {
                    return (
                        <div key={index} className="w-1/4">
                            <h1>{day.toDateString()}</h1>
                            <ul>
                                {mealsSchedule?.map((mealSchedule:any, index: number) => {
                                    return <li key={index}>{mealSchedule.mealName}</li>
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Schedule;