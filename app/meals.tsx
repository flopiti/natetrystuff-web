import { useEffect, useState } from 'react';
import AddMealForm from './components/AddMealForm';
import MealList from './MealList';
import { getMeals, addMeal, deleteMeal, updateMeal } from './mealService';
import { MealIngredient } from './types';
import { useFormState } from './useFormState';

const Meals = () => {
  const [meals, setMeals] = useState<any[]>([]);
  const [isAddMealFormVisible, setIsAddMealFormVisible] = useState(false);
  const {
    formMealName, setFormMealName, formMealIngredients, setFormMealIngredients, handleInputChange, handleAddIngredient, handleRemoveIngredient
  } = useFormState();

  useEffect(() => {
    getMeals().then((data:any) => setMeals(data));
  }, []);

  return (
    <div className='h-[70vh] border-2 border-white w-full p-4 overflow-auto'>
      <button className='mx-2 bg-blue-500 p-2 rounded text-white' onClick={() => setIsAddMealFormVisible(!isAddMealFormVisible)}>
        Add Meal
      </button>
      <MealList
          meals={meals}
          deleteMeal={(meal:any) => deleteMeal(meal, setMeals)}
          updateMeal={(mealId:any, name:any, ingredients:any) => updateMeal(mealId, name, ingredients, setMeals)}
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
          addMeal={(name, ingredients) => addMeal(name, ingredients, setMeals)}
        />
      )}
    </div>
  );
};

export default Meals;
