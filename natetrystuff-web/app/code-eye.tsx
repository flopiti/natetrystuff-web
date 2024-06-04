import React, { useEffect, useState } from 'react';

const CodeEye = () => {
    const [projects, setProjects] = useState<string[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                const result = await response.json();
                setProjects(result.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

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
            <div>
                <h3>Projects:</h3>
                <ul>
                    {projects.map((project, index) => (
                        <li key={index}>{project}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CodeEye;
