import { ProjectPath } from "@/interfaces/project";
import { getAllPineconeNode, getAllProjects, getProjectFiles } from "@/services/mainService";
import { fetchProjectPaths } from "@/services/projectPathService";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Dropdown from "./UI/Dropdown";
import {AnimatePresence, motion, Variants} from 'framer-motion';

import React from "react";
import Loader from "./UI/Loader";




const CodeV2 = () => {

    //state
    const [allProjects, setAllProjects] = useState<Project[]>([]);
    const [projectPath, setProjectPath] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const [files, setFiles] = useState<string[]>([]);
    const [nodes, setNodes] = useState<any[]>([]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
    }

    const getStats = () => {
        if (!selectedProject) return;
        getProjectFiles(selectedProject).then((files: any[]) => {
            setFiles(files);
           });
        getAllPineconeNode().then((nodes: any) => {
            setNodes(nodes);
        }   );
    }

    useEffect(() => {
        if (!selectedProject) return;
        getStats();
    }, [selectedProject]);

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

    return (
        <div className="font-AlphaLyrae ">
            <div className="flex justify-center">
                <Loader loading={false}  className="my-2 mx-12"/>
                <Dropdown<Project> onSelect={handleSelectProject} selectedOption={selectedProject} options={allProjects} labelKey='name' />
                
            </div>
            
      </div>
      );
}

export default CodeV2;