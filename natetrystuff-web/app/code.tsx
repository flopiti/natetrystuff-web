const Code = () => {


    const addGetOneToMeal = async () => {
        const response = await fetch('/api/add-request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
    }

    return (
        <div className="bg-yellow-500 flex-grow w-full p-4 m-24">
            <button onClick={()=>addGetOneToMeal()}>Add Get One to Meals</button>
        </div>
    );
}

export default Code;