import React, { useState, useEffect, ChangeEvent } from 'react';

interface Task {
    taskId: number;
    description: string;
    completed: boolean;
}

interface Objective {
    objectiveId: number;
    finishedState: string;
    finished: boolean;
    tasks: Task[]; // Include tasks array
}

interface FormState {
    finishedState: string;
}

const ToDo: React.FC = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [form, setForm] = useState<FormState>({ finishedState: '' });
    const [taskDescription, setTaskDescription] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchObjectives = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/objectives');
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            const fetchedObjectives: Objective[] = Array.isArray(data.data) ? data.data : [data.data];
            setObjectives(fetchedObjectives);
        } catch (err) {
            console.error('Failed to fetch objectives:', err);
            setError('Failed to fetch objectives. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObjectives();
    }, []);

    const handleAddTask = async (objectiveId: number) => {
        if (!taskDescription.trim()) {
            alert('Task description cannot be empty.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/objectives/${objectiveId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description: taskDescription.trim(), completed: false }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            await fetchObjectives(); // Refresh objectives to get updated tasks
            setTaskDescription('');
        } catch (err) {
            console.error('Failed to add task:', err);
            setError('Failed to add task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col w-full p-4">
            <h1 className="text-2xl font-bold mb-4">ToDo List</h1>

            <div className="mb-4 flex flex-col items-center w-full">
                <input
                    type="text"
                    value={form.finishedState}
                    onChange={(e) => setForm({ ...form, finishedState: e.target.value })}
                    placeholder="Add new objective"
                    className="border p-2 rounded w-full max-w-md mb-2"
                />
                <button 
                    onClick={() => { /* Add objective function here */ }} 
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded w-full max-w-md hover:bg-blue-600 transition"
                >
                    {loading ? 'Adding...' : 'Add Objective'}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {loading && <p>Loading...</p>}

            {objectives.length > 0 ? (
                <ul className="w-full">
                    {objectives.map(obj => (
                        <li 
                            key={obj.objectiveId} 
                            className={`flex flex-col bg-white p-4 mb-4 rounded text-black ${obj.finished ? 'line-through' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <span 
                                        className={`inline-block w-3 h-3 mr-2 rounded-full ${obj.finished ? 'bg-white' : 'bg-green-500'}`}
                                    />
                                    {obj.finishedState}
                                </div>
                                <div>
                                    <button 
                                        onClick={() => {/* Edit function here */}} 
                                        disabled={loading}
                                        className="bg-yellow-500 text-white p-1 rounded mr-2 hover:bg-yellow-600 transition"
                                    >
                                        {obj.finished ? 'Undo' : 'Complete'}
                                    </button>
                                    <button 
                                        onClick={() => {/* Delete function here */}} 
                                        disabled={loading}
                                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {obj.tasks && obj.tasks.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <h3>Tasks:</h3>
                                    <pre>{JSON.stringify(obj.tasks, null, 2)}</pre>
                                </div>
                            )}
                            <div className="flex mt-2">
                                <input
                                    type="text"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    placeholder="Add new task"
                                    className="border p-2 rounded-l w-full"
                                />
                                <button
                                    onClick={() => handleAddTask(obj.objectiveId)}
                                    disabled={loading}
                                    className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition"
                                >
                                    Add Task
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No objectives to show</p>
            )}
        </div>
    );
}

export default ToDo;
