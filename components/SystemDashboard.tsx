import React from 'react';

const files = [
    { id: 1, name: 'File 1', DESC: 1, FEAT: 3 },
    { id: 2, name: 'File 2', DESC: 0, FEAT: 5 },
    { id: 3, name: 'File 3', DESC: 1, FEAT: 2 },
];

const SystemDashboard = () => {
    return (
        <div className="flex flex-col p-4">
            {files.map(file => (
                <div key={file.id} className="file-item p-2 border rounded bg-gray-200 text-black">
                    <div className="flex flex-row items-center space-x-4">
                        <div className="file-name font-bold">{file.name}</div>
                        <div className="desc">DESC: {file.DESC}</div>
                        <div className="feat">FEAT: {file.FEAT}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;
