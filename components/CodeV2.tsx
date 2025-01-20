import { ProjectPath } from "@/interfaces/project";
import { getAllPineconeNode, getAllProjects, getProjectFiles } from "@/services/mainService";
import { fetchProjectPaths } from "@/services/projectPathService";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Dropdown from "./UI/Dropdown";
import {AnimatePresence, motion, Variants} from 'framer-motion';

import React from "react";
import Loader from "./UI/Loader";
import CustomButton from "./UI/CustomButton";




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

    const handleEmbed = () => {
        console.log('Embed');
    }

    const handleReembed = () => {
        console.log('Reembed');
    }

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


    //3. Fetch stats
    useEffect(() => {
        if (!selectedProject) return;
        if (!selectedProject) return;
        getProjectFiles(selectedProject).then((files: any[]) => {
            setFiles(files);
           });
        getAllPineconeNode().then((nodes: any) => {
            setNodes(nodes.matches);
        });
    }, [selectedProject]);


    return (
        <div className="font-Orbitron ">
            <div className="flex justify-center">
                <Dropdown<Project> onSelect={handleSelectProject} selectedOption={selectedProject} options={allProjects} labelKey='name' />
            </div>                            
            {
                selectedProject && (
                    <div className="flex justify-center items-center gap-10 my-10"> 
                        <Loader loading={false}/>
                        <span className="text-sm">{`${nodes?.length} / ${files?.length} embedded`}</span>
                        <span className="flex">
                            <CustomButton onClick={() => handleEmbed} >Embed</CustomButton>
                            <CustomButton className="-ml-[0.0625rem]" onClick={() => handleReembed} >Re-embed</CustomButton>
                        </span>                    
                    </div>
                )
            }
      </div>
      );
}

export default CodeV2;