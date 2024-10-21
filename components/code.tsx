//DESC: This file contains the implementation of a component for creating new resources and establishing class relationships.
import { use, useState } from "react";

const Code = () => {
    const[newResourceName, setNewResourceName] = useState('');


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

    const[class1Name, setClass1Name] = useState('');
    const[class2Name, setClass2Name] = useState('');

    const hasMany = async (class1:string, class2:string) => {
        const response = await fetch(`/api/has-many`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ class1, class2 })});
        const data = await response.json();
    }

    return (
        <div className="bg-yellow-500 flex-grow w-full p-4 m-24">
            <input type="text" className="text-black" placeholder="Enter resource name" value={newResourceName} onChange={(e:any)=>setNewResourceName(e.target.value)} />
            <input type="text" className="text-black"  placeholder="Enter property1" value={property1Name} onChange={(e:any)=>setNewProperty1Name(e.target.value)} />
            <button onClick={()=>createNewResource()}>
                Create New Resource
            </button>
            <div>
                <input type="text" className="text-black" placeholder="Class1" value={class1Name} onChange={(e:any)=>setClass1Name(e.target.value)} />
                <span>  Has many</span>
                <input type="text" className="text-black" placeholder="Class2" value={class2Name} onChange={(e:any)=>setClass2Name(e.target.value)} />
                <button onClick={()=>hasMany(class1Name, class2Name)}>
                    Create Relationship
                </button>
            </div>
        </div>
    );
}

export default Code;
