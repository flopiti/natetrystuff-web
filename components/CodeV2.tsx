import { ProjectPath } from "@/interfaces/project";
import { getAllPineconeNode, getAllProjects, getProjectFiles } from "@/services/mainService";
import { fetchProjectPaths } from "@/services/projectPathService";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Dropdown from "./UI/Dropdown";
import {AnimatePresence, motion} from 'framer-motion';

import React from "react";

const Loader = () => {
const grid = [
  [0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 0],
];

const dotVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="loader">
      {grid.map((row, i) => (
        <div key={i} className="row">
          {row.map((col, j) => (
            <motion.div
              key={j}
              className={`dot ${col ? "filled" : ""}`}
              variants={dotVariants}
              animate="animate"
            />
          ))}
        </div>
      ))}
    </div>
  );
};



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
            <Loader />
            <Dropdown<Project> onSelect={handleSelectProject} selectedOption={selectedProject} options={allProjects} labelKey='name' />
            
      </div>
      );
}

export default CodeV2;