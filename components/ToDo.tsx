import React, { useState, useEffect, ChangeEvent } from 'react';

interface Objective {
    id: string;
    objective: string;
    finished: boolean;
}

interface FormState {
    objective: string;
}

const ToDo: React.FC = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [form, setForm] = useState<FormState>({ objective: '' });
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
            setObjectives(data.data);
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
        if (!form.objective.trim()) {
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
                    objective: form.objective.trim(), 
                    finished: false 
                }),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const newObjective = await response.json();
            setObjectives([...objectives, newObjective.data]);
            setForm({ objective: '' });
        } catch (err) {
            console.error('Failed to add objective:', err);
            setError('Failed to add objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id: string, currentStatus: boolean) => {
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
                obj.id === id ? { ...obj, finished: !currentStatus } : obj
            ));
        } catch (err) {
            console.error('Failed to update objective:', err);
            setError('Failed to update objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
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

            setObjectives(objectives.filter(obj => obj.id !== id));
        } catch (err) {
            console.error('Failed to delete objective:', err);
            setError('Failed to delete objective. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, objective: e.target.value });
    };

    return (
        <div>
            <h1>ToDo List</h1>

            <div>
                <input
                    type="text"
                    value={form.objective}
                    onChange={handleInputChange}
                    placeholder="Add new objective"
                />
                <button onClick={handleAdd} disabled={loading}>
                    {loading ? 'Adding...' : 'Add'}
                </button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading && <p>Loading...</p>}

            {objectives.length > 0 ? (
                <ul>
                    {objectives.map(obj => (
                        <li key={obj.id} style={{ textDecoration: obj.finished ? 'line-through' : 'none' }}>
                            {obj.objective}
                            <button 
                                onClick={() => handleEdit(obj.id, obj.finished)} 
                                disabled={loading}
                                style={{ marginLeft: '10px' }}
                            >
                                {obj.finished ? 'Undo' : 'Complete'}
                            </button>
                            <button 
                                onClick={() => handleDelete(obj.id)} 
                                disabled={loading}
                                style={{ marginLeft: '5px' }}
                            >
                                Delete
                            </button>
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
