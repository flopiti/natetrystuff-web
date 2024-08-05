import { useState } from 'react';
import { MealIngredient } from './types';

export const useFormState = () => {
  const [formMealName, setFormMealName] = useState('');
  const [formMealIngredients, setFormMealIngredients] = useState<MealIngredient[]>([
    { ingredientName: '', quantity: 0, unit: '', mealIngredientId: null }
  ]);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedMealIngredients = formMealIngredients.map((meal, idx) => {
      if (idx === index) {
        return { ...meal, [field]: value };
      }
      return meal;
    });
    setFormMealIngredients(updatedMealIngredients);
  };

  const handleAddIngredient = () => {
    setFormMealIngredients([...formMealIngredients, { ingredientName: '', quantity: 0, unit: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setFormMealIngredients(formMealIngredients.filter((item, idx) => idx !== index));
  };

  return {
    formMealName, setFormMealName, formMealIngredients, setFormMealIngredients, handleInputChange, handleAddIngredient, handleRemoveIngredient
  };
};
