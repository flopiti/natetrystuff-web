'use client';

import { useState, useEffect } from 'react';

const SshConnect = () => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState();

    useEffect(() => {
        if (!sessionId) {
            startNewSession();
        }
    }, [sessionId]);

    const startNewSession = async () => {
        try {
            const response = await fetch('/api/ssh-connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: '', sessionId: null }),
            });

            const result = await response.json();

            if (response.ok) {
                setSessionId(result.sessionId);
            } else {
                setError('Failed to start session');
            }
        } catch (err) {
            console.error('Failed to start session', err);
            setError('Failed to start session');
        }
    };

    const handleCommand = async (newCommand = command) => {
        if (!sessionId) {
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/ssh-connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: newCommand, sessionId }),
            });

            const result = await response.json();
            console.log('Result:', result);
            if (response.ok) {
                setOutput((prevOutput) => prevOutput + '\n' + result.output);
                setError(result.error);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Failed to execute SSH command', err);
            setError('Failed to execute SSH command');
        } finally {
            setLoading(false);
        }
    };

    const moveToWebApp = async () => {
        const newCommand = 'cd /dev-projects/natetrystuff-web/natetrystuff-web';
        setCommand(newCommand);
        await handleCommand(newCommand);
        setCommand('');
    };

    return (
        <div>
            <h2>SSH Connect</h2>
            <div>
                <input
                    type='text'
                    placeholder='Command'
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    className='text-black bg-white border border-gray-300 px-2 py-1 rounded'
                />
            </div>
            <button onClick={() => handleCommand()} className='mt-2 px-4 py-2 bg-blue-500 text-white rounded' disabled={loading}>
                {loading ? 'Executing...' : 'Execute Command'}
            </button>
            <button onClick={moveToWebApp} className='mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded' disabled={loading || !sessionId}>
                {loading ? 'Moving...' : 'Move to Web-App'}
            </button>
            <div>
                <h3>Output:</h3>
                <pre className='max-h-64 overflow-y-auto bg-gray-900 text-white p-3'>{output}</pre>
                <h3>Error:</h3>
                <pre className='max-h-64 overflow-y-auto bg-red-500 text-white p-3'>{error}</pre>
            </div>
        </div>
    );
};

export default SshConnect;
