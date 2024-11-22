import React, { useState, useEffect, ChangeEvent } from 'react';

interface Objective {
    objectiveId: number;
    finishedState: string;
    finished: boolean;
}

interface FormState {
    finishedState: string;
}

const ToDo: React.FC = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [form, setForm] = useState<FormState>({ finishedState: '' });
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

    const handleAdd = async () => {
        if (!form.finishedState.trim()) {
            alert('Objective cannot be empty.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/objectives', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    finishedState: form.finishedState.trim(), 
                    finished: false 
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const newObjective = await response.json();
            setObjectives([...objectives, newObjective.data]);
            setForm({ finishedState: '' });
        } catch (err) {
            console.error('Failed to add objective:', err);
            setError('Failed to add objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: number, currentStatus: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/objectives/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            setObjectives(objectives.map(obj => 
                obj.objectiveId === id ? { ...obj, finished: !currentStatus } : obj
            ));
        } catch (err) {
            console.error('Failed to update objective:', err);
            setError('Failed to update objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this objective?')) {
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/objectives/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            setObjectives(objectives.filter(obj => obj.objectiveId !== id));
        } catch (err) {
            console.error('Failed to delete objective:', err);
            setError('Failed to delete objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, finishedState: e.target.value });
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4">{/* Removed bg-gray-100 */}
            <h1 className="text-2xl font-bold mb-4">ToDo List</h1>

            <div className="mb-4 flex flex-col items-center w-full">
                <input
                    type="text"
                    value={form.finishedState}
                    onChange={handleInputChange}
                    placeholder="Add new objective"
                    className="border p-2 rounded w-full max-w-md mb-2"
                />
                <button 
                    onClick={handleAdd} 
                    disabled={loading}
                    className="bg-blue-500 text-white p-2 rounded w-full max-w-md hover:bg-blue-600 transition"
                >
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {loading && <p>Loading...</p>}

            {objectives.length > 0 ? (
                <ul className="w-full max-w-md">
                    {objectives.map(obj => (
                        <li 
                            key={obj.objectiveId} 
                            className={`flex justify-between items-center bg-white p-2 mb-2 rounded ${obj.finished ? 'line-through' : ''}`}
                        >
                            <div className="flex items-center">
                                <span 
                                    className={`inline-block w-3 h-3 mr-2 rounded-full ${obj.finished ? 'bg-white' : 'bg-green-500'}`}
                                />
                                {obj.finishedState}
                            </div>
                            <div>
                                <button 
                                    onClick={() => handleEdit(obj.objectiveId, obj.finished)} 
                                    disabled={loading}
                                    className="bg-yellow-500 text-white p-1 rounded mr-2 hover:bg-yellow-600 transition"
                                >
                                    {obj.finished ? 'Undo' : 'Complete'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(obj.objectiveId)} 
                                    disabled={loading}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
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
