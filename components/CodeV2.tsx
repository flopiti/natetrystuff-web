import { ProjectPath } from "@/interfaces/project";
import { getAllProjects } from "@/services/gitService";
import { fetchProjectPaths } from "@/services/projectPathService";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Dropdown from "./UI/Dropdown";

const CodeV2 = () => {

    //state
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [projectPath, setProjectPath] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    //fetch useEffects
    //1. Fetch project paths
    useEffect(() => {
        fetchProjectPaths().then((data: ProjectPath[]) => {
            setProjectPath(data[0].path);
        });
    }, []);

    //2. Fetch all projects
    useEffect(() => {
        if (!projectPath) return;
        getAllProjects(projectPath).then((projects:Project[]) => {
            setAllProjects(projects);
        });
    }, [projectPath]);


    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
    }

    return (
        <div>
            <h1>Embeddings Page</h1>
            <Dropdown onSelect={setSelectedProject} options={allProjects} labelKey={'name'} />
        </div>
    );
}

export default CodeV2;