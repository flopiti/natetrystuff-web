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
        <div className="p-10 m-5 h-[65vh] bg-gray-500 border-2 border-black rounded-lg w-full h-screen text-black">
            <button onClick={runAnalysis} className="mb-4 bg-blue-500 text-white p-2 rounded">Run Analysis</button>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Projects:</h3>
                <ul className="list-disc pl-5">
                    {projects.map((project, index) => (
                        <li key={index}>{project}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CodeEye;
