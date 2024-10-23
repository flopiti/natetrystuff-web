//DESC: Dashboard to display and add processes, using /api/process
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const ProcessDashboard = () => {
    const [processes, setProcesses] = useState([]);
    const [processStarted, setProcessStarted] = useState(false);
    const conversation = useSelector((state: RootState) => state.Messages.messages);

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
        // Adding status: 'active' to the new process
        const processWithStatus = { ...newProcess, status: 'active' };
        await fetch('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(processWithStatus)
        });
        console.log('Process added, fetching updated processes...');
        fetchProcesses();
    };

    const processTheProcess = () => {
        console.log('Current conversation:', conversation);
        // Here you can transform the conversation into the desired process format
        addProcess({ name: 'New Process from Conversation', conversation });
    };

    const handleStart = () => {
        setProcessStarted(true);
    };

    const handleEnd = () => {
        if (processStarted) {
            processTheProcess();
            setProcessStarted(false);
        } else {
            alert('Process not started!');
        }
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
            <button 
                onClick={handleStart}
                className='mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300'
            >
                Start
            </button>
            <button 
                onClick={handleEnd}
                className='mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300'
            >
                End
            </button>
        </div>
    );
};

export default ProcessDashboard;
