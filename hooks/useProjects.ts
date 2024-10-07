import { useState } from "react";

const useProjects = () => {
    const [dirPath, setDirPath] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [projectFiles, setProjectFiles] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [branch, setBranch] = useState<string | null>(null);

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
        setSelectedFileContent,
        branch,
        setBranch
    };
}

export default useProjects;