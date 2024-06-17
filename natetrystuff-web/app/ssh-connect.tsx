'use client';

import { useState } from 'react';

const SshConnect = () => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleConnect = async () => {
        try {
            const response = await fetch('/api/ssh-connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ command }),
            });

            const result = await response.json();

            if (response.ok) {
                setOutput(result.stdout);
                setError(result.stderr);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Failed to execute SSH command', err);
            setError('Failed to execute SSH command');
        }
    };

    return (
        <div>
            <h2>SSH Connect</h2>
            <div>
                <input
                    type="text"
                    placeholder="Command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className="text-black bg-white border border-gray-300 px-2 py-1 rounded"
                />
            </div>
            <button onClick={handleConnect} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Execute Command</button>
            <div>
                <h3>Output:</h3>
                <pre>{output}</pre>
                <h3>Error:</h3>
                <pre>{error}</pre>
            </div>
        </div>
    );
};

export default SshConnect;
