import { useEffect, useState } from "react";

const Meals = () => {

    interface MealIngredient {
        ingredientName: string;
        quantity: number;
        unit: string;
    }
    const [meals, setMeals] = useState<any[]>([]);
    const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false);
    const [formMealName, setFormMealName] = useState<any>('')
    const [formMealIngredients, setFormMealIngredients] = useState<MealIngredient[]>([
        {  ingredientName:'', quantity: 0, unit: '' },
        {  ingredientName:'', quantity: 0, unit: '' },
        {  ingredientName:'', quantity: 0, unit: '' }
      ]);

    const getMeals = async () => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        console.log(data)
        setMeals(data);
    }
    console.log(meals)

    useEffect(() => {
        getMeals();
    }
    
    , []);
    const addMeal = async (name:any, mealIngredients:any) => {
        const meal = {mealName: name, mealIngredients: mealIngredients.filter(
            (mealIngredient: { ingredientName: string; quantity: number; unit: string;}) => mealIngredient.ingredientName !== '' && mealIngredient.quantity !== 0 && mealIngredient.unit !== '')}
        const mealz = JSON.stringify({meal})
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: mealz,
        });
        const data = await response.json();
        setMeals([...meals, data.data]);
        }

    const deleteMeal = async (meal:any) => {
        const response = await fetch(`/api/meals/${meal.mealId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setMeals(meals.filter((m:any) => m.mealId !== meal.mealId));
    }  
    const handleInputChange = (index:number, field:any, value:any)=> {
        console.log(index, field, value)
        const updatedMealIngredients = formMealIngredients.map((meal:any, idx:any) => {
          if (idx === index) {
            return { ...meal, [field]: value };
          }
          return meal;
        });
        setFormMealIngredients(updatedMealIngredients);
      };
      

    return (
        <div  className="h-[70vh] border-2 border-white w-full">
            <button className="mx-2" onClick={()=>setIsAddMealFormVisible(!isAddMealFormVisible)}>
                Add Meal
            </button>
            <ul className="list-disc ml-5">
                {meals?.map((meal:any, index: number) => {
                    return <li key={index} className="">
                        <span>{meal.mealName}</span><button className="mx-2" onClick={()=>deleteMeal(meal)}>X</button>
                        <ul className="list-disc ml-10">
                        {
                            meal.mealIngredients?.map((mealIngredients:any, index:number) => {
                                return <li key={index}>
                                    <span>{mealIngredients.quantity}</span>
                                    <span>{mealIngredients.unit}</span>
                                    <span>{mealIngredients.ingredientName}</span>
                                </li>
                            })
                        }
                        </ul>

                        </li>
                })}
                
            </ul>
            {
                isAddMealFormVisible && (
                    <div>
                        <input className="text-black" type="text" placeholder="Meal Name" value={formMealName} onChange={(e)=>setFormMealName(e.target.value)} />
                        <div>
                        {formMealIngredients.map((mealIngredient, index) => {
                            return (
                            <div key={index}>
                            <input
                                className="text-black"
                                type="text"
                                value={mealIngredient.ingredientName}
                                onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value)}
                                placeholder="Meal Name"
                            />
                            <input
                                className="text-black"
                                type="number"
                                value={mealIngredient.quantity}
                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                placeholder="Quantity"
                            />
                            <input
                                className="text-black"
                                type="text"
                                value={mealIngredient.unit}
                                onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                                placeholder="Unit"
                            />
                            </div>)
                        }    
                    )}

                        </div>

                        <button onClick={()=>addMeal(formMealName, formMealIngredients)}>Add Meal</button>
                    </div>
                )
            }
        </div>
    );
}

export default Meals;