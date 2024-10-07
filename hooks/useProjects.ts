import { useState } from "react";

const useProjects = () => {
    const [dirPath, setDirPath] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [projectFiles, setProjectFiles] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    
    return {
        dirPath,
        setDirPath,
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        projectFiles,
        setProjectFiles,
        selectedFileName,
        setSelectedFileName,
        selectedFileContent,
        setSelectedFileContent
    };
}

export default useProjects;