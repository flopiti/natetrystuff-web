import { useEffect, useState } from 'react';

interface FileListDropdownProps {
    projects: any[],
    selectedProject: any,
    setSelectedProject: (project: any) => void,
    projectFiles: any[],
    handleFlightClick: (projectFile: any, event: any) => void,
    selectedFileName: string,
    highlightedFiles: any[],
    chatCodes: any[],
    setSelectedChatCode: (code: any) => void
}

const FileListDropdown: React.FC<FileListDropdownProps> = ({ projects, selectedProject, setSelectedProject, projectFiles, handleFlightClick, selectedFileName, highlightedFiles, chatCodes, setSelectedChatCode }) => {
    const handleSelectedProjectChange = (event: any) => {
        const pr = projects.find((project:any) => project.name === event.target.value);
        setSelectedProject(pr ? pr : null);
    };

    return (
        <div className="w-1/5 bg-gray-100 text-black">
            <div className="sticky top-0 bg-gray-100">
                <select value={selectedProject ? selectedProject.name : ''} onChange={handleSelectedProjectChange} className="w-full p-2">
                    <option value="" disabled>Select a project</option>
                    {projects.map((project:any) => (
                        <option key={project.name} value={project.name}>
                            {project.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="h-full overflow-auto">
                {projectFiles.length > 0 && projectFiles.map((projectFile: any, index: number) => {
                    const isHighlighted = highlightedFiles.includes(projectFile);
                    const doWeHaveChatCode = chatCodes?.find((fileData: any) => fileData.fileName === projectFile);
                    return (
                        <div
                            key={index}
                            onClick={event => handleFlightClick(projectFile, event)}
                            className={`p-2 cursor-pointer hover:bg-gray-200', ${ isHighlighted ? `bg-yellow-300` : ''}`}
                        >
                            <p style={{ fontWeight: selectedFileName === projectFile ? 'bold' : 'normal' }}>
                                {projectFile}
                            </p>
                            {doWeHaveChatCode && <img width={30} height={30} src="/openai.svg" alt="Open" />}
                        </div>
                    );
                })}
                {chatCodes?.length > 0 && chatCodes?.filter(({fileName}) => !projectFiles.includes(fileName)).map(({fileName, code}, index) => (
                    <div
                        key={projectFiles.length + index}
                        onClick={() => setSelectedChatCode(code)}
                        className="p-2 cursor-pointer hover:bg-gray-200 bg-purple-300"
                    >
                        <p style={{ fontWeight: selectedFileName === fileName ? 'bold' : 'normal' }}>
                            {fileName}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileListDropdown;
