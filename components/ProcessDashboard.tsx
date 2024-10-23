//DESC: Dashboard to display and add processes, using /api/process
import { useState, useEffect } from 'react';

const ProcessDashboard = () => {
    const [processes, setProcesses] = useState([]);

    const fetchProcesses = async () => {
        console.log('Fetching processes...');
        try {
            const response = await fetch('api/process', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store'

                }
            });
            console.log('Response status:', response.status);

            const result = await response.json();
            console.log('Fetched data:', result);
            
            if (Array.isArray(result.data)) {
                setProcesses(result.data);
            } else {
                console.error('Data is not an array:', result.data);
            }
        } catch (error) {
            console.error('Error fetching processes:', error);
        }
    };

    const addProcess = async (newProcess: any) => {
        console.log('Adding process:', newProcess);
        await fetch('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProcess)
        });
        console.log('Process added, fetching updated processes...');
        fetchProcesses();
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    return (
        <div className='w-1/3 flex-1 p-4  bg-[#2f2f2f] rounded-lg shadow-md'>
            <h2 className='text-xl font-bold mb-4'>Process Dashboard</h2>
            <ul className='list-disc pl-5'>
                {processes.map((process:any) => (
                    <li key={process.id} className='mb-2 text-blue-300'>{process.process}</li>
                ))}
            </ul>
            <button 
                onClick={() => addProcess({ name: 'New Process' })}
                className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'
            >
                Add Process
            </button>
        </div>
    );
};

export default ProcessDashboard;
