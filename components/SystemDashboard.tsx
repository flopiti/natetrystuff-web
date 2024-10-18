import { Project } from '@/types/project';
import React, { useState, useEffect } from 'react';

export interface SystemDashboardProps {
    project: Project;
}

const SystemDashboard = ({project}:SystemDashboardProps) => {
    const [files, setFiles] = useState([
        { id: 1, name: 'File 1', DESC: 1, FEAT: 3 },
        { id: 2, name: 'File 2', DESC: 0, FEAT: 5 },
        { id: 3, name: 'File 3', DESC: 1, FEAT: 2 },
    ]);

    console.log(files)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/file-descriptions?project=${project.name}`);
                const response_ = await response.json();
                setFiles(response_.data);
            } catch (error) {
                console.error('Error fetching file descriptions:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="w-1/2 bg-blue-200 flex flex-col h-full overflow-y-scroll text-black text-xs p-2">
            {files.map((file,index) => (
                <div key={index} className="file-item p-2 border rounded bg-gray-200 text-black">
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="file-name font-bold col-span-1">{file.name}</div>
                        <div className="desc col-span-1">DESC: {file.DESC}</div>
                        <div className="feat col-span-1">FEAT: {file.FEAT}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;