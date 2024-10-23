//DESC: Dashboard to display and add processes, using /api/process
import { useState, useEffect } from 'react';

const ProcessDashboard = () => {
    const [processes, setProcesses] = useState([]);

    const fetchProcesses = async () => {
        const response = await fetch('/api/process', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        setProcesses(result.data);
    };

    const addProcess = async (newProcess: any) => {
        await fetch('/api/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProcess)
        });
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