import Image from 'next/image';
import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';

interface Project {
    name: string;
}

interface ProjectFile {
    path: string;
}

interface ChatCode {
    fileName: string;
    code: string;
}

interface FileListDropdownProps {
    projects: Project[],
    selectedProject: Project | null,
    setSelectedProject: (project: Project | null) => void,
    projectFiles: string[],
    handleFlightClick: (projectFile: string, event: React.MouseEvent<HTMLDivElement>) => void,
    selectedFileName: string,
    highlightedFiles: string[],
    chatCodes: ChatCode[],
    setSelectedChatCode: (code: string) => void, 
    dirPath: string,
    setDirPath: (dirPath: string) => void
}

const FileListDropdown: React.FC<FileListDropdownProps> = ({ projects, selectedProject, setSelectedProject, projectFiles, handleFlightClick, selectedFileName, highlightedFiles, chatCodes, setSelectedChatCode, dirPath, setDirPath }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [projectPaths, setProjectPaths] = useState<ProjectFile[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setShowOptions(true);
    };

    const handleOptionClick = (option: ProjectFile) => {
        setInputValue(option.path);
        setShowOptions(false);
        setDirPath(option.path);
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            if (!projectPaths.some(p => p.path === inputValue)) {
                try {
                    const response = await fetch('/api/project-paths', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ path: inputValue }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to create project path: ${response.statusText}`);
                    }

                    const updatedPaths = await getProjectPath();
                    setProjectPaths(updatedPaths);
                } catch (error) {
                    console.error('Failed to create project path:', error);
                }
            }
            setInputValue('');
            setShowOptions(false);
        }
    };

    const handleSelectedProjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const pr = projects.find((project) => project.name === event.target.value);
        setSelectedProject(pr ? pr : null);
    };

    async function getProjectPath() {
        try {
            const response = await fetch(`/api/project-paths`);
            if (!response.ok) {
                throw new Error(`Failed to fetch project paths: ${response.statusText}`);
            }
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Failed to fetch project paths:', error);
        }
    }

    const handleRemoveOption = async (option: ProjectFile) => {
        try {
            const response = await fetch('/api/project-paths', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ path: option.path }),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove project path: ${response.statusText}`);
            }

            const updatedPaths = await getProjectPath();
            setProjectPaths(updatedPaths);
        } catch (error) {
            console.error('Failed to remove project path:', error);
        }
    };

    const filteredFiles = projectFiles.filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()));
    useEffect(() => {
        getProjectPath().then((data: ProjectFile[]) => {
            setProjectPaths(data);
        });
    }, []); 

    const filteredOptions = projectPaths.filter((option) =>
        option.path.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="w-1/5 bg-gray-100 text-black">
            <div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onClick={() => setShowOptions(!showOptions)}
                />
                {showOptions && (
                    <ul>
                        {filteredOptions.map((option, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span
                                    onClick={() => handleOptionClick(option)}
                                    className="truncate max-w-xs"
                                >
                                    {option.path}
                                </span>
                                <button
                                    onClick={() => handleRemoveOption(option)}
                                    className="ml-2 text-red-500"
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="sticky top-0 bg-gray-100 p-2">
                <select value={selectedProject ? selectedProject.name : ''} onChange={handleSelectedProjectChange} className="w-full p-2 mb-2">
                    <option value="" disabled>Select a project</option>
                    {projects?.map((project) => (
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
                {filteredFiles.length > 0 && filteredFiles.map((projectFile, index) => {
                    const isHighlighted = highlightedFiles.includes(projectFile);
                    const doWeHaveChatCode = chatCodes?.find((fileData) => fileData.fileName === projectFile);
                    return (
                        <div
                            key={index}
                            onClick={event => handleFlightClick(projectFile, event)}
                            className={`p-2 cursor-pointer hover:bg-gray-200 ${isHighlighted ? 'bg-yellow-300' : ''}`}
                        >
                            <p style={{ fontWeight: selectedFileName === projectFile ? 'bold' : 'normal' }}>
                                {projectFile}
                            </p>
                            {doWeHaveChatCode && <Image width={30} height={30} src="/openai.svg" alt="Open" />}
                        </div>
                    );
                })}
                {chatCodes?.length > 0 && chatCodes?.filter(({ fileName }) => !projectFiles.includes(fileName)).map(({ fileName, code }, index) => (
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
