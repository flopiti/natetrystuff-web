import { MealIngredient } from './types';

export const getMeals = async () => {
  const response = await fetch('/api/meals');
  const data = (await response.json()).data;
  return data;
};

// Updated setMeals type to use (meals: any[] | ((prevMeals: any[]) => any[])) => void
export const addMeal = async (name: any, mealIngredients: any[], imageUrl: string, setMeals: any) => {
  const meal = {
    mealName: name,
    imageUrl: imageUrl, // Including image URL
    mealIngredients: mealIngredients
      .filter(mi => mi.ingredientName !== '' && mi.quantity !== 0 && mi.unit !== '')
      .map((ingredient, index) => ({ ...ingredient, mealIngredientId: index + 1 }))
  };
  const response = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meal }),
  });
  const data = await response.json();
  setMeals((prevMeals: any[]) => [...prevMeals, data.data]); // Ensure data.data is of type Meal
};

export const deleteMeal = async (meal: any, setMeals: (meals: any[] | ((prevMeals: any[]) => any[])) => void) => {
  await fetch(`/api/meals/${meal.mealId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  setMeals((prevMeals: any[]) => prevMeals.filter(m => m.mealId !== meal.mealId));
};

export const updateMeal = async (mealId: number, name: string, mealIngredients: MealIngredient[], imageUrl: string, setMeals: (meals: any[] | ((prevMeals: any[]) => any[])) => void) => {
  const meal = {
    mealName: name,
    imageUrl: imageUrl, // Including image URL
    mealIngredients: mealIngredients
      .filter(mi => mi.ingredientName !== '' && mi.quantity !== 0 && mi.unit !== '')
      .map((ingredient, index) => ({ ...ingredient, mealIngredientId: ingredient.mealIngredientId || index + 1 }))
  };
  const response = await fetch(`/api/meals/${mealId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(meal),
  });
  const updatedMeal = await response.json();
  setMeals((prevMeals: any[]) => prevMeals.map(m => m.mealId === mealId ? updatedMeal : m));
};