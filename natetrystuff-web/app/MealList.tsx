import { useState } from 'react';

interface MealIngredient {
  ingredientName: string;
  quantity: number;
  unit: string;
  mealIngredientId?: number | null;
}

const MealList = ({ meals, deleteMeal, updateMeal }: any) => {
  const [editMealId, setEditMealId] = useState<number | null>(null);
  const [editMealName, setEditMealName] = useState('');
  const [editMealIngredients, setEditMealIngredients] = useState<MealIngredient[]>([]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedMealIngredients = editMealIngredients.map((meal, idx) => {
      if (idx === index) {
        return { ...meal, [field]: value };
      }
      return meal;
    });
    setEditMealIngredients(updatedMealIngredients);
  };

  const handleAddIngredient = () => {
    setEditMealIngredients([...editMealIngredients, { ingredientName: '', quantity: 0, unit: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setEditMealIngredients(editMealIngredients.filter((item, idx) => idx !== index));
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
              {meal.mealIngredients?.map((mealIngredient: any, index: number) => {
                return (
                  <li key={index}>
                    <span>{mealIngredient.quantity} {mealIngredient.unit} of {mealIngredient.ingredientName}</span>
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
                  {editMealIngredients.map((mealIngredient: any, index: number) => (
                    <div key={index} className='flex items-center mb-2'>
                      <input
                        className='text-black p-2 rounded mr-2 flex-1'
                        type='text'
                        value={mealIngredient.ingredientName}
                        onChange={(e) => handleInputChange(index, 'ingredientName', e.target.value)}
                        placeholder='Ingredient Name'
                      />
                      <input
                        className='text-black p-2 rounded mr-2 w-24'
                        type='number'
                        value={mealIngredient.quantity}
                        onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                        placeholder='Quantity'
                      />
                      <input
                        className='text-black p-2 rounded mr-2 w-24'
                        type='text'
                        value={mealIngredient.unit}
                        onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                        placeholder='Unit'
                      />
                      <button className='bg-red-500 text-white p-2 rounded' onClick={() => handleRemoveIngredient(index)}>Remove</button>
                    </div>
                  ))}
                  <button className='bg-blue-500 text-white p-2 rounded mt-2' onClick={handleAddIngredient}>Add Ingredient</button>
                </div>
                <button className='bg-green-500 text-white p-2 rounded mt-2' onClick={() => updateMeal(meal.mealId, editMealName, editMealIngredients)}>Update Meal</button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default MealList;
