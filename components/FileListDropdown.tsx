import {  addProjectPath, fetchProjectPaths, removeProjectPath } from '@/services/projectPathService';
import Image from 'next/image';
import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';
import { ProjectFile } from '@/types/project';
import { setProjectDir } from '@/slices/ProjectSlice';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';

interface Project {
    name: string;
}

interface FileListDropdownProps {
    projects: Project[],
    selectedProject: Project | null,
    setSelectedProject: (project: Project | null) => void,
    projectFiles: string[],
    handleFlightClick: (projectFile: string, event: React.MouseEvent<HTMLDivElement>) => void,
    selectedFileName: string | null,
    highlightedFiles: ProjectFile[],
    chatCodes: ProjectFile[],
    setSelectedFileName: (code: string) => void, 
}

const FileListDropdown: React.FC<FileListDropdownProps> = ({ projects,handleFlightClick, selectedProject, setSelectedProject, projectFiles, selectedFileName, highlightedFiles, chatCodes, setSelectedFileName }) => {
    const dispatch: AppDispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [projectPaths, setProjectPaths] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setShowOptions(true);
    };

    const handleOptionClick = (option: any) => {
        setInputValue(option.path);
        setShowOptions(false);
        dispatch(setProjectDir(option.path));
    };

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            if (!projectPaths.some(p => p.path === inputValue)) {
                try {
                    await addProjectPath(inputValue);
                    const updatedPaths = await fetchProjectPaths();
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

    const handleRemoveOption = async (option: any) => {
        try {
            await removeProjectPath(option.path);
            const updatedPaths = await fetchProjectPaths();
            setProjectPaths(updatedPaths);
        } catch (error) {
            console.error('Failed to remove project path:', error);
        }
    };

    useEffect(() => {
        fetchProjectPaths().then((data: any[]) => {
            setProjectPaths(data);
            if (data.length === 1) {
                dispatch(setProjectDir(data[0].path));
                setInputValue(data[0].path);
            }
        });
    }, []); 

    const filteredFiles = projectFiles
        .filter(file => file.toLowerCase().includes(searchTerm.toLowerCase()) && file !== '')
        .sort((a, b) => {
            const aIsHighlighted = highlightedFiles.map((highlightedFile) => highlightedFile.name).includes(a);
            const bIsHighlighted = highlightedFiles.map((highlightedFile) => highlightedFile.name).includes(b);
            if (aIsHighlighted && !bIsHighlighted) return -1;
            if (!aIsHighlighted && bIsHighlighted) return 1;
            return 0;
        });

    const filteredOptions = projectPaths.filter((option) =>
        option.path.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="w-1/5 overflow-auto bg-gray-100 text-black">
            <div className="sticky top-0 bg-gray-100 p-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onClick={() => setShowOptions(!showOptions)}
                    className="w-full p-2 mb-2 border"
                />
                {showOptions && (
                    <ul className="bg-white border rounded shadow-md max-h-60 overflow-auto">
                        {filteredOptions.map((option, index) => (
                            <li key={index} className="flex justify-between items-center p-2">
                                <span
                                    onClick={() => handleOptionClick(option)}
                                    className="truncate max-w-xs cursor-pointer"
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
            <div className="overflow-auto">
                {filteredFiles.map((projectFile, index) => {
                    const isHighlighted = highlightedFiles.map(
                        (highlightedFile) => highlightedFile.name
                    ).includes(projectFile);
                    const chatCode = chatCodes?.find((fileData) => fileData.name === projectFile);
                    return (
                        <div
                            key={index}
                            onClick={event => handleFlightClick(projectFile, event)}
                            className={`p-2 cursor-pointer hover:bg-gray-200 ${isHighlighted ? 'bg-yellow-300' : ''} w-full`}
                        >
                            <div className="overflow-x-auto">
                                <p className={`whitespace-nowrap ${selectedFileName === projectFile ? 'font-bold' : 'font-normal'}`}>
                                    {projectFile}
                                </p>
                            </div>
                            {chatCode && <Image width={30} height={30} src="/openai.svg" alt="Open" />}
                        </div>
                    );
                })}
                {chatCodes?.filter(({ name }) => name !== '' && !projectFiles.includes(name)).map(({ name, content }, index) => (
                    <div
                        key={projectFiles.length + index}
                        onClick={() => setSelectedFileName(name)}
                        className="p-2 cursor-pointer hover:bg-gray-200 bg-purple-300 w-full"
                    >
                        <div className="overflow-x-auto">
                            <p className={`whitespace-nowrap ${selectedFileName === name ? 'font-bold' : 'font-normal'}`}>
                                {name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileListDropdown;
