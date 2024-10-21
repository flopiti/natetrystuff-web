import { Project } from '@/types/project';
import React, { useState, useEffect } from 'react';

export interface SystemDashboardProps {
    project: Project;
}

const SystemDashboard = ({project}:SystemDashboardProps) => {
    const [files, setFiles] = useState([]);

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
            {files.map((file, index) => (
                <div 
                    key={index} 
                    className="file-item p-2 border rounded bg-gray-200 text-black flex items-center justify-between"
                >
                    <div className="file-name font-bold truncate overflow-hidden whitespace-nowrap" style={{ maxWidth: '200px' }}>
                        {file.name}
                    </div>
                    <div className="desc">DESC: {file.DESC}</div>
                    {file.DESC === 0 && <button className="get-desc-btn">Get a DESC</button>}
                    <div className="feat">FEAT: {file.FEAT}</div>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;