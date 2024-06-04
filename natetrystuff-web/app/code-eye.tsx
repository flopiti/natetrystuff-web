import React from 'react';

const CodeEye = () => {
    const runAnalysis = async () => {
        try {
            const response = await fetch('/api/code-eye', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            console.log('Analysis result:', result);
        } catch (error) {
            console.error('Error running analysis:', error);
        }
    };

    return (
        <div style={{ border: '1px solid black', padding: '20px', width: '200px', height: '100px' }}>
            <button onClick={runAnalysis}>Run Analysis</button>
        </div>
    );
};

export default CodeEye;
