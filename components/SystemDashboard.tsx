import React from 'react';

const files = [
    { id: 1, name: 'File 1', DESC: 0, FEAT: 5 },
    { id: 2, name: 'File 2', DESC: 1, FEAT: 3 },
    { id: 3, name: 'File 3', DESC: 0, FEAT: 7 },
];

const SystemDashboard = () => {
    return (
        <div className="flex justify-around p-4 bg-gray-100">
            {files.map(file => (
                <div key={file.id} className="file-item flex flex-col items-center p-2 border rounded shadow-md bg-white">
                    <div className="font-bold">{file.name}</div>
                    <div>DESC: {file.DESC}</div>
                    <div>FEAT: {file.FEAT}</div>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;
