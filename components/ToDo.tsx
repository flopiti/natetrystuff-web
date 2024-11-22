import { useState, useEffect } from 'react';

const ToDo = () => {
    const [objectives, setObjectives] = useState([]);
    const [form, setForm] = useState({ id: '', objective: '' });

    useEffect(() => {
        // Fetch current objectives
        fetch('/api/objectives')
          .then(response => {
              console.log('Response:', response); // Log the response
              return response.json();
          })
          .then(data => setObjectives(data.data));
    }, []);

    const handleAdd = async () => {
        const response = await fetch('/api/objectives', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ objective: form.objective }),
        });
        const newObjective = await response.json();
        setObjectives([...objectives, newObjective.data]);
        setForm({ id: '', objective: '' }); // Reset form
    };

    const handleEdit = async id => {
        await fetch(`/api/objectives/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        fetchObjectives(); // Refresh objectives
    };

    const handleDelete = async id => {
        await fetch(`/api/objectives/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        setObjectives(objectives.filter(obj => obj.id !== id));
    };

    return (
        <div>
            <h1>ToDo List</h1>
            <input
                type="text"
                value={form.objective}
                onChange={(e) => setForm({ ...form, objective: e.target.value })}
                placeholder="Add new objective"
            />
            <button onClick={handleAdd}>Add</button>
            {objectives.length > 0 ? (
                <ul>
                    {objectives.map(obj => (
                        <li key={obj.id}>
                            {obj.objective}
                            <button onClick={() => handleEdit(obj.id)}>Complete</button>
                            <button onClick={() => handleDelete(obj.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No objectives to show</p>
            )}
        </div>
    );
}

export default ToDo;
