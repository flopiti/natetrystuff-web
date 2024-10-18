import React from 'react';

const files = [
    { id: 1, name: 'File 1', DESC: 0, FEAT: 3 },
    { id: 2, name: 'File 2', DESC: 1, FEAT: 5 },
    { id: 3, name: 'File 3', DESC: 0, FEAT: 2 },
];

const SystemDashboard = () => {
    return (
        <div className="flex flex-col p-4">
            {files.map(file => (
                <div key={file.id} className="file-item bg-gray-100 p-2 m-2 rounded-lg shadow-md">
                    <h2 className="text-black font-semibold">{file.name}</h2>
                    <p className="text-black">DESC: {file.DESC}</p>
                    <p className="text-black">FEAT: {file.FEAT}</p>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;