import { useEffect, useState } from "react";

const Meals = () => {

    const [meals, setMeals] = useState<any>([]);
    

    const getMeals = async () => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        setMeals(data);
    }
    console.log(meals);

    useEffect(() => {
        getMeals();
    }
    , []);

    return (
        <div  className="h-[70vh] border-2 border-white w-full">
            <ul>
                {meals?.map((meal:any, index: number) => {
                    console.log(meal)
                    return <li key={index}>{meal.mealName}</li>
                })}
            </ul>
        </div>
    );
}

export default Meals;