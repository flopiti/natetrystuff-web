import { use, useState } from "react";

const Code = () => {
    const[newResourceName, setNewResourceName] = useState('');
    const addGetOneToMeal = async () => {
        const response = await fetch('/api/add-request', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
    }

    const createNewResource = async () => {
        const response = await fetch(`/api/create-new-resource/${newResourceName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propertieName: property1Name }), // Corrected to use property value
        });
        const data = await response.json();
    }

    const [property1Name, setProperty1Name] = useState('');
    const setNewProperty1Name = async (name:string) => {
        setProperty1Name(name)
    }

    return (
        <div className="bg-yellow-500 flex-grow w-full p-4 m-24">
            <button onClick={()=>addGetOneToMeal()}>Add Get One to Meals</button>
            <input type="text" className="text-black" placeholder="Enter resource name" value={newResourceName} onChange={(e:any)=>setNewResourceName(e.target.value)} />
            <input type="text" className="text-black"  placeholder="Enter property1" value={property1Name} onChange={(e:any)=>setNewProperty1Name(e.target.value)} />
            <button onClick={()=>createNewResource()}>
                Create New Resource
            </button>
        </div>
    );
}

export default Code;