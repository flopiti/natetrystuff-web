//DESC: Component for adding a meal, including its ingredients, quantity, and units.
interface MealIngredient {
  ingredientName: string;
  quantity: number;
  unit: string;
  mealIngredientId?: number | null;
}

interface AddMealFormProps {
  formMealName: string;
  formMealIngredients: MealIngredient[];
  setFormMealName: (name: string) => void;
  setFormMealIngredients: (ingredients: MealIngredient[]) => void;
  handleInputChange: (index: number, field: string, value: any, type: 'form' | 'edit') => void;
  handleAddIngredient: (type: 'form' | 'edit') => void;
  handleRemoveIngredient: (index: number, type: 'form' | 'edit') => void;
  addMeal: (name: string, imageUrl: string, mealIngredients: MealIngredient[]) => Promise<void>;
}

const AddMealForm: React.FC<AddMealFormProps> = ({
  formMealName,
  formMealIngredients,
  setFormMealName,
  setFormMealIngredients,
  handleInputChange,
  handleAddIngredient,
  handleRemoveIngredient,
  addMeal
}) => {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <div className='mt-4 bg-gray-200 p-4 rounded'>
      <input
        className='text-black p-2 rounded w-full mb-2'
        type='text'
        placeholder='Meal Name'
        value={formMealName}
        onChange={(e) => setFormMealName(e.target.value)}
      />
      <input
        className='text-black p-2 rounded w-full mb-2'
        type='text'
        placeholder='Image URL'
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
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
      <button className='bg-green-500 text-white p-2 rounded mt-2' onClick={() => addMeal(formMealName, imageUrl, formMealIngredients)}>Add Meal</button>
    </div>
  );
};

export default AddMealForm;
