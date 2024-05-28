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
    const [editMealId, setEditMealId] = useState<number | null>(null);
    const [editMealName, setEditMealName] = useState<any>('');
    const [editMealIngredients, setEditMealIngredients] = useState<MealIngredient[]>([]);

    const getMeals = async () => {
        const response = await fetch('/api/meals');
        const data = (await response.json()).data;
        setMeals(data);
    }

    useEffect(() => {
        getMeals();
    }
    , []);
    const addMeal = async (name:any, mealIngredients:any) => {
        const meal = {mealName: name, mealIngredients: mealIngredients.filter(
            (mealIngredient: { ingredientName: string; quantity: number; unit: string;}) => mealIngredient.ingredientName !== '' && mealIngredient.quantity !== 0 && mealIngredient.unit !== '')}
        const response = await fetch('/api/meals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meal),
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

    const updateMeal = async (mealId: number, name: any, mealIngredients: any) => {
        const meal = {mealName: name, mealIngredients: mealIngredients.filter(
            (mealIngredient: { ingredientName: string; quantity: number; unit: string;}) => mealIngredient.ingredientName !== '' && mealIngredient.quantity !== 0 && mealIngredient.unit !== '')}
        const response = await fetch(`/api/meals/${mealId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(meal),
        });
        const updatedMeal = await response.json();
        setMeals(meals.map(m => m.mealId === mealId ? updatedMeal : m));
        setEditMealId(null);
    }  

    const handleInputChange = (index:number, field:any, value:any, type: 'form' | 'edit') => {
        let updatedMealIngredients;
        if (type === 'form') {
            updatedMealIngredients = formMealIngredients.map((meal:any, idx:any) => {
                if (idx === index) {
                    return { ...meal, [field]: value };
                }
                return meal;
            });
            setFormMealIngredients(updatedMealIngredients);
        } else if (type === 'edit') {
            updatedMealIngredients = editMealIngredients.map((meal:any, idx:any) => {
                if (idx === index) {
                    return { ...meal, [field]: value };
                }
                return meal;
            });
            setEditMealIngredients(updatedMealIngredients);
        }
    }

    const startEditMeal = (meal: any) => {
        setEditMealId(meal.mealId);
        setEditMealName(meal.mealName);
        setEditMealIngredients(meal.mealIngredients);
    }

    return (
        <div  className="h-[70vh] border-2 border-white w-full">
            <button className="mx-2" onClick={()=>setIsAddMealFormVisible(!isAddMealFormVisible)}>
                Add Meal
            </button>
            <ul className="list-disc ml-5">
                {meals?.map((meal:any, index: number) => {
                    return <li key={index} className="">
                        <span>{meal.mealName}</span>
                        <button className="mx-2" onClick={()=>deleteMeal(meal)}>X</button>
                        <button className="mx-2" onClick={() => startEditMeal(meal)}>Edit</button>
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

                        {editMealId === meal.mealId && (
                            <div>
                                <input className="text-black" type="text" placeholder="Meal Name" value={editMealName} onChange={(e)=>setEditMealName(e.target.value)} />
                                <div>
                                    {editMealIngredients.map((mealIngredient, index) => (
                                        <div key={index}>
                                            <input
                                                className="text-black"
                                                type="text"
                                                value={mealIngredient.ingredientName}
                                                onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value, 'edit')}
                                                placeholder="Meal Name"
                                            />
                                            <input
                                                className="text-black"
                                                type="number"
                                                value={mealIngredient.quantity}
                                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value, 'edit')}
                                                placeholder="Quantity"
                                            />
                                            <input
                                                className="text-black"
                                                type="text"
                                                value={mealIngredient.unit}
                                                onChange={(e) => handleInputChange(index, 'unit', e.target.value, 'edit')}
                                                placeholder="Unit"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => updateMeal(meal.mealId, editMealName, editMealIngredients)}>Update Meal</button>
                            </div>
                        )}

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
                                onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value, 'form')}
                                placeholder="Meal Name"
                            />
                            <input
                                className="text-black"
                                type="number"
                                value={mealIngredient.quantity}
                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value, 'form')}
                                placeholder="Quantity"
                            />
                            <input
                                className="text-black"
                                type="text"
                                value={mealIngredient.unit}
                                onChange={(e) => handleInputChange(index, 'unit', e.target.value, 'form')}
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