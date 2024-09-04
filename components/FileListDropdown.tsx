import Image from 'next/image';
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
    setSelectedChatCode: (code: any) => void, 
    dirPath: string,
    setDirPath: (dirPath: string) => void
}

const FileListDropdown: React.FC<FileListDropdownProps> = ({ projects, selectedProject, setSelectedProject, projectFiles, handleFlightClick, selectedFileName, highlightedFiles, chatCodes, setSelectedChatCode,dirPath,  setDirPath }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projectPath, setProjectPath] = useState<string[]>([]);

    const handleSelectedProjectChange = (event: any) => {
        const pr = projects.find((project:any) => project.name === event.target.value);
        setSelectedProject(pr ? pr : null);
    };

    async function getProjectPath() {
        try {
            const response = await fetch(`/api/project-paths`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.data;
            
        } catch (error) {
            console.error('Failed to fetch project paths:', error);
        }
    }

    const filteredFiles = projectFiles.filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()));
    useEffect(() => {
        getProjectPath().then((data:string[]) => {
            setProjectPath(data);
        });
    }, []); 

    return (
        <div className="w-1/5 bg-gray-100 text-black">
            <textarea className="text-black p-2 whitespace-pre-wrap break-words" value={dirPath} onChange={(e) => setDirPath(e.target.value)} /> 

            <div className="sticky top-0 bg-gray-100 p-2">
                <select value={selectedProject ? selectedProject.name : ''} onChange={handleSelectedProjectChange} className="w-full p-2 mb-2">
                    <option value="" disabled>Select a project</option>
                    {projects?.map((project:any) => (
                        <option key={project.name} value={project.name}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className="w-full p-2 mb-2 border"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="h-[500px] overflow-auto">
                {filteredFiles.length > 0 && filteredFiles.map((projectFile: any, index: number) => {
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
                            {doWeHaveChatCode && <Image width={30} height={30} src="/openai.svg" alt="Open" />}
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
