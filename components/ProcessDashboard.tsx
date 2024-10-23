//DESC: Dashboard to display and add processes, using /api/process
import { useState, useEffect } from 'react';

const ProcessDashboard = () => {
    const [processes, setProcesses] = useState([]);

    const fetchProcesses = async () => {
        console.log('Fetching processes...');
        try {
            const response = await fetch('/api/process', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
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
        <div>
            <h2>Process Dashboard</h2>
            <ul>
                {processes.map((process) => (
                    <li key={process.id}>{process.name}</li>
                ))}
            </ul>
            <button onClick={() => addProcess({ name: 'New Process' })}>Add Process</button>
        </div>
    );
};

export default ProcessDashboard;
