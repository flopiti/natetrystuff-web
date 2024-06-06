import React, { useEffect, useState } from 'react';

const CodeEye = () => {
    const [projects, setProjects] = useState<string[]>([]);
    const [files, setFiles] = useState<string[]>([]);
    const [functions, setFunctions] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

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

    const fetchProjectFiles = async (projectName: string) => {
        try {
            const response = await fetch(`/api/project-files?projectName=${projectName}`);
            const result = await response.json();
            setFiles(result.files);
            setSelectedProject(projectName);
        } catch (error) {
            console.error('Error fetching project files:', error);
        }
    };

    const fetchFileFunctions = async (fileName: string) => {
        try {
            const response = await fetch(`/api/file-functions?fileName=${fileName}`);
            const result = await response.json();
            setFunctions(result.functions);
            setSelectedFile(fileName);
        } catch (error) {
            console.error('Error fetching file functions:', error);
        }
    };

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
        <div className="p-10 m-5 h-[62vh] bg-gray-500 border-2 border-black rounded-lg w-full h-screen text-black overflow-scroll">
            <button onClick={runAnalysis} className="mb-4 bg-blue-500 text-white p-2 rounded">Run Analysis</button>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Projects:</h3>
                <ul className="list-disc pl-5">
                    {projects.map((project, index) => (
                        <li key={index} onClick={() => fetchProjectFiles(project)} className="cursor-pointer">{project}</li>
                    ))}
                </ul>
            </div>
            {selectedProject && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Files in {selectedProject}:</h3>
                    <ul className="list-disc pl-5">
                        {files.map((file, index) => (
                            <li key={index} onClick={() => fetchFileFunctions(file)} className="cursor-pointer">{file}</li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedFile && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Functions in {selectedFile}:</h3>
                    <ul className="list-disc pl-5">
                        {functions.length === 0 ? (
                            <li className="text-red-500 font-bold">No functions found in this file.</li>
                        ) : (
                            functions.map((func, index) => (
                                <li key={index}>{func}</li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CodeEye;
