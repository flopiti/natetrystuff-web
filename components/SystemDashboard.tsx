import React from 'react';

const files = [
    { id: 1, name: 'File 1', desc: 0, feat: 5 },
    { id: 2, name: 'File 2', desc: 1, feat: 3 },
    { id: 3, name: 'File 3', desc: 0, feat: 7 },
];

const SystemDashboard = () => {
    return (
        <div className="flex justify-around p-4 bg-gray-100">
            {files.map(file => (
                <div key={file.id} className="file-item bg-blue-500 text-white p-4 m-2">
                    <h3>{file.name}</h3>
                    <p>DESC: {file.desc}</p>
                    <p>FEAT: {file.feat}</p>
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;