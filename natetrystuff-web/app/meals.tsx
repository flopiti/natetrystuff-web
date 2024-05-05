import { useEffect, useState } from "react";

const Meals = () => {

    const [meals, setMeals] = useState<any>([]);
    const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false);
    const [newMealName, setNewMealName] = useState('');
    const getMeals = async () => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        setMeals(data);
    }

    useEffect(() => {
        getMeals();
    }
    , []);

    const addMeal = async (meal:any) => {
        meal = {mealName: meal}
        const mealz = JSON.stringify(meal)
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: mealz,
        });
        const data = await response.json();
    }

    const deleteMeal = async (meal:any) => {
        const response = await fetch(`/api/meals/${meal.mealId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
    }  

    return (
        <div  className="h-[70vh] border-2 border-white w-full">
            <button className="mx-2" onClick={()=>setIsAddMealFormVisible(!isAddMealFormVisible)}>
                Add Meal
            </button>
            <ul>
                {meals?.map((meal:any, index: number) => {
                    return <li key={index}><span>{meal.mealName}</span><button className="mx-2" onClick={()=>deleteMeal(meal)}>X</button></li>
                })}
                
            </ul>
            {
                isAddMealFormVisible && (
                    <div>
                        <input className="text-black" type="text" placeholder="Meal Name" value={newMealName} onChange={(e)=>setNewMealName(e.target.value)}/>
                        <input type="text" placeholder="Ingredient" />
                        <input type="text" placeholder="Ingredient" />
                        <input type="text" placeholder="Ingredient"/>
                        <button onClick={()=>addMeal(newMealName)}>Add Meal</button>
                    </div>
                )
            }
        </div>
    );
}

export default Meals;