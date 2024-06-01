import { MealIngredient } from './types';

export const getMeals = async () => {
  const response = await fetch('/api/meals');
  const data = (await response.json()).data;
  return data;
};


// Update setMeals to use Meal[]
export const addMeal = async (name: string, mealIngredients: MealIngredient[], setMeals: (meals: any[]) => void) => {
  const meal = {
    mealName: name,
    mealIngredients: mealIngredients
      .filter(mi => mi.ingredientName !== '' && mi.quantity !== 0 && mi.unit !== '')
      .map((ingredient, index) => ({...ingredient, mealIngredientId: index + 1}))
  };
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({meal}),
  });
  const data = await response.json();
  setMeals((prevMeals: any[]) => [...prevMeals, data.data]); // Ensure data.data is of type Meal
};
export const deleteMeal = async (meal: any, setMeals: (meals: any[]) => void) => {
  await fetch(`/api/meals/${meal.mealId}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  });
  setMeals(prevMeals => prevMeals.filter(m => m.mealId !== meal.mealId));
};

export const updateMeal = async (mealId: number, name: string, mealIngredients: MealIngredient[], setMeals: (meals: any[]) => void) => {
  const meal = {
    mealName: name,
    mealIngredients: mealIngredients
      .filter(mi => mi.ingredientName !== '' && mi.quantity !== 0 && mi.unit !== '')
      .map((ingredient, index) => ({...ingredient, mealIngredientId: ingredient.mealIngredientId || index + 1}))
    };
    const response = await fetch(`/api/meals/${mealId}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(meal),
    });
    const updatedMeal = await response.json();
    setMeals(prevMeals => prevMeals.map(m => m.mealId === mealId ? updatedMeal : m));
};
