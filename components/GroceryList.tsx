//DESC: This file defines a React component that renders a list of grocery items.
const GroceryList = ({groceries} :any) => {
    return (
        <div className='mt-4 p-4 bg-yellow-100 rounded-lg shadow-lg'>
        <h2 className='text-xl font-bold mb-2 text-black'>Groceries</h2>
        {groceries.length > 0 ? (
            <ul>
                {groceries.map((grocery: any, index: number) => (
                    <li key={index} className='text-gray-700'>
                      <span>{grocery.quantity} {grocery.unit} of {grocery.ingredient.ingredientName}</span>
                    </li>
                ))}
            </ul>
        ) : <p className='text-gray-500'>No groceries listed</p>}
    </div>
    );
}

export default GroceryList;