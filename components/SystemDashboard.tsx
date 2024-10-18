import React from 'react';

const files = [
    { id: 1, name: 'File 1' },
    { id: 2, name: 'File 2' },
    { id: 3, name: 'File 3' },
];

const SystemDashboard = () => {
    return (
        <div className="flex justify-around p-4">
            {files.map(file => (
                <div key={file.id} className="file-item">
                    {file.name}
                </div>
            ))}
        </div>
    );
};

export default SystemDashboard;