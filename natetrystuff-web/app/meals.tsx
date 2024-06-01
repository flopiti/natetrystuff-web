import { useEffect, useState } from 'react';
import AddMealForm from './AddMealForm';
import MealList from './MealList';

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
      <MealList
          meals={meals}
          deleteMeal={deleteMeal}
          startEditMeal={startEditMeal}
          editMealId={editMealId}
          editMealName={editMealName}
          editMealIngredients={editMealIngredients}
          setEditMealName={setEditMealName}
          handleInputChange={handleInputChange}
          handleAddIngredient={handleAddIngredient}
          handleRemoveIngredient={handleRemoveIngredient}
          updateMeal={updateMeal}
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
          addMeal={addMeal}
        />
      )}
    </div>
  );
};

export default Meals;
