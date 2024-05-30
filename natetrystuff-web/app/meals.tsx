import { useEffect, useState } from 'react';

const Meals = () => {
  
  interface MealIngredient {
    ingredientName: string;
    quantity: number;
    unit: string;
    mealIngredientId?: number | null;
  }
  const [meals, setMeals] = useState<any[]>([]);
  const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false);
  const [formMealName, setFormMealName] = useState('');
  const [formMealIngredients, setFormMealIngredients] = useState<MealIngredient[]>([
    { ingredientName: '', quantity: 0, unit: '', mealIngredientId: null }
  ]);
  const [editMealId, setEditMealId] = useState<number | null>(null);
  const [editMealName, setEditMealName] = useState('');
  const [editMealIngredients, setEditMealIngredients] = useState<MealIngredient[]>([]);

  const getMeals = async () => {
    const response = await fetch('/api/meals');
    const data = (await response.json()).data;
    setMeals(data);
  };

  useEffect(() => {
    getMeals();
  }, []);

  const addMeal = async (name: any, mealIngredients: any) => {
    const meal = {
      mealName: name,
      mealIngredients: mealIngredients
        .filter((mealIngredient: { ingredientName: string; quantity: number; unit: string }) =>
          mealIngredient.ingredientName !== '' && mealIngredient.quantity !== 0 && mealIngredient.unit !== ''
        )
        .map((ingredient: MealIngredient, index: number) => ({
          ...ingredient,
          mealIngredientId: index + 1, // Generate ID for each ingredient
        })),
    };
    console.log(meal);
    const response = await fetch('/api/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({meal}),
    });
    const data = await response.json();
    setMeals([...meals, data.data]);
  };

  const deleteMeal = async (meal: any) => {
    const response = await fetch(`/api/meals/${meal.mealId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setMeals(meals.filter((m: any) => m.mealId !== meal.mealId));
  };

  const updateMeal = async (mealId: number, name: any, mealIngredients: any) => {
    const meal = {
      mealName: name,
      mealIngredients: mealIngredients
        .filter((mealIngredient: { ingredientName: string; quantity: number; unit: string }) =>
          mealIngredient.ingredientName !== '' && mealIngredient.quantity !== 0 && mealIngredient.unit !== ''
        )
        .map((ingredient: MealIngredient, index: number) => ({
          ...ingredient,
          mealIngredientId: ingredient.mealIngredientId || index + 1,
        })),
    };
    console.log('updating meal', meal)
    const response = await fetch(`/api/meals/${mealId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meal),
    });
    const updatedMeal = await response.json();
    setMeals(meals.map((m) => (m.mealId === mealId ? updatedMeal : m)));
    setEditMealId(null);
  };

  const handleInputChange = (index: number, field: string, value: any, type: 'form' | 'edit') => {
    let updatedMealIngredients;
    if (type === 'form') {
      updatedMealIngredients = formMealIngredients.map((meal: any, idx: any) => {
        if (idx === index) {
          return { ...meal, [field]: value };
        }
        return meal;
      });
      setFormMealIngredients(updatedMealIngredients);
    } else if (type === 'edit') {
      updatedMealIngredients = editMealIngredients.map((meal: any, idx: any) => {
        if (idx === index) {
          return { ...meal, [field]: value };
        }
        return meal;
      });
      setEditMealIngredients(updatedMealIngredients);
    }
  };

  const handleAddIngredient = (type: 'form' | 'edit') => {
    if (type === 'form') {
      setFormMealIngredients([...formMealIngredients, { ingredientName: '', quantity: 0, unit: '' }]);
    } else if (type === 'edit') {
      setEditMealIngredients([...editMealIngredients, { ingredientName: '', quantity: 0, unit: '' }]);
    }
  };

  const handleRemoveIngredient = (index: number, type: 'form' | 'edit') => {
    if (type === 'form') {
      setFormMealIngredients(formMealIngredients.filter((item, idx) => idx !== index));
    } else if (type === 'edit') {
      setEditMealIngredients(editMealIngredients.filter((item, idx) => idx !== index));
    }
  };

  const startEditMeal = (meal: any) => {
    if (editMealId === meal.mealId) {
      setEditMealId(null); // If the same meal is clicked, close the edit box
    } else {
      setEditMealId(meal.mealId);
      setEditMealName(meal.mealName);
      setEditMealIngredients(meal.mealIngredients);
    }
  };

  return (
    <div className='h-[70vh] border-2 border-white w-full p-4'>
      <button className='mx-2 bg-blue-500 p-2 rounded text-white' onClick={() => setIsAddMealFormVisible(!isAddMealFormVisible)}>
        Add Meal
      </button>
      <ul className='list-disc ml-5'>
        {meals?.map((meal: any, index: number) => {
          return (
            <li key={index} className='mb-4'>
              <span className='font-bold'>{meal.mealName}</span>
              <button className='mx-2 bg-red-500 p-1 rounded text-white' onClick={() => deleteMeal(meal)}>
                X
              </button>
              <button className='mx-2 bg-yellow-500 p-1 rounded text-white' onClick={() => startEditMeal(meal)}>
                Edit
              </button>
              <ul className='list-disc ml-10'>
                {meal.mealIngredients?.map((mealIngredients: any, index: number) => {
                  return (
                    <li key={index}>
                      <span>{mealIngredients.quantity} {mealIngredients.unit} of {mealIngredients.ingredientName}</span>
                    </li>
                  );
                })}
              </ul>

              {editMealId === meal.mealId && (
                <div className='mt-4 bg-gray-200 p-4 rounded'>
                  <input
                    className='text-black p-2 rounded w-full mb-2'
                    type='text'
                    placeholder='Meal Name'
                    value={editMealName}
                    onChange={(e) => setEditMealName(e.target.value)}
                  />
                  <div>
                    {editMealIngredients.map((mealIngredient, index) => (
                      <div key={index} className='flex items-center mb-2'>
                        <input
                          className='text-black p-2 rounded mr-2 flex-1'
                          type='text'
                          value={mealIngredient.ingredientName}
                          onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value, 'edit')}
                          placeholder='Ingredient Name'
                        />
                        <input
                          className='text-black p-2 rounded mr-2 w-24'
                          type='number'
                          value={mealIngredient.quantity}
                          onChange={(e) => handleInputChange(index, 'quantity', e.target.value, 'edit')}
                          placeholder='Quantity'
                        />
                        <input
                          className='text-black p-2 rounded mr-2 w-24'
                          type='text'
                          value={mealIngredient.unit}
                          onChange={(e) => handleInputChange(index, 'unit', e.target.value, 'edit')}
                          placeholder='Unit'
                        />
                        <button className='bg-red-500 text-white p-2 rounded' onClick={() => handleRemoveIngredient(index, 'edit')}>Remove</button>
                      </div>
                    ))}
                    <button className='bg-blue-500 text-white p-2 rounded mt-2' onClick={() => handleAddIngredient('edit')}>Add Ingredient</button>
                  </div>
                  <button className='bg-green-500 text-white p-2 rounded mt-2' onClick={() => updateMeal(meal.mealId, editMealName, editMealIngredients)}>Update Meal</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {isAddMealFormVisible && (
        <div className='mt-4 bg-gray-200 p-4 rounded'>
          <input
            className='text-black p-2 rounded w-full mb-2'
            type='text'
            placeholder='Meal Name'
            value={formMealName}
            onChange={(e) => setFormMealName(e.target.value)}
          />
          <div>
            {formMealIngredients.map((mealIngredient, index) => {
              return (
                <div key={index} className='flex items-center mb-2'>
                  <input
                    className='text-black p-2 rounded mr-2 flex-1'
                    type='text'
                    value={mealIngredient.ingredientName}
                    onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value, 'form')}
                    placeholder='Ingredient Name'
                  />
                  <input
                    className='text-black p-2 rounded mr-2 w-24'
                    type='number'
                    value={mealIngredient.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value, 'form')}
                    placeholder='Quantity'
                  />
                  <input
                    className='text-black p-2 rounded mr-2 w-24'
                    type='text'
                    value={mealIngredient.unit}
                    onChange={(e) => handleInputChange(index, 'unit', e.target.value, 'form')}
                    placeholder='Unit'
                  />
                  <button className='bg-red-500 text-white p-2 rounded' onClick={() => handleRemoveIngredient(index, 'form')}>Remove</button>
                </div>
              );
            })}
            <button className='bg-blue-500 text-white p-2 rounded mt-2' onClick={() => handleAddIngredient('form')}>Add Ingredient</button>
          </div>
          <button className='bg-green-500 text-white p-2 rounded mt-2' onClick={() => addMeal(formMealName, formMealIngredients)}>Add Meal</button>
        </div>
      )}
    </div>
  );
};

export default Meals;
