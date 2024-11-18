//DESC: This file defines a Meals component that manages and displays meals with functionality to add, update, and delete meals.

import { useEffect, useState } from 'react';
import AddMealForm from './AddMealForm';
import MealList from './MealList';
import { getMeals, addMeal, deleteMeal, updateMeal } from '../utils/mealService';
import { MealIngredient } from '../utils/types';
import { useFormState } from '../utils/useFormState';

const Meals = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false);
  const {
    formMealName, setFormMealName, formMealIngredients, setFormMealIngredients, handleInputChange, handleAddIngredient, handleRemoveIngredient
  } = useFormState();
  
  useEffect(() => {
    getMeals().then((data:any) => setMeals(data));
  }, []);

  const handleAddMeal = async (name: string, ingredients: MealIngredient[], imageUrl:any) => {
    await addMeal(name, ingredients, imageUrl, setMeals);
    setIsAddMealFormVisible(false);
  }

  return (
    <div className='h-[70vh] border-2 border-white w-full p-4 overflow-auto'>
      <button className='mx-2 bg-blue-500 p-2 rounded text-white' onClick={() => setIsAddMealFormVisible(!isAddMealFormVisible)}>
        Add Meal
      </button>
      <MealList
          meals={meals}
          deleteMeal={(meal:any) => deleteMeal(meal, setMeals)}
          updateMeal={(mealId:any, name:any, ingredients:any, imageUrl:any) => updateMeal(mealId, name, ingredients, imageUrl, setMeals)}
      />
      {isAddMealFormVisible && (
        <AddMealForm
          formMealName={formMealName}
          formMealIngredients={formMealIngredients}
          setFormMealName={setFormMealName}
          setFormMealIngredients={setFormMealIngredients}
          handleInputChange={handleInputChange}
          handleAddIngredient={handleAddIngredient}
          handleRemoveIngredient={handleRemoveIngredient}
          addMeal={handleAddMeal}
        />
      )}
    </div>
  );
};

export default Meals;
