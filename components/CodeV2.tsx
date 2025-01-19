import { ProjectPath } from "@/interfaces/project";
import { getAllProjects } from "@/services/gitService";
import { fetchProjectPaths } from "@/services/projectPathService";
import { Project } from "@/types/project";
import { useEffect, useState } from "react";
import Dropdown from "./UI/Dropdown";
import {AnimatePresence, motion} from 'framer-motion';

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
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1>{selectedProject.name}</h1>
            </motion.div>
          ) : (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Dropdown<Project> onSelect={handleSelectProject} options={allProjects} labelKey='name' />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      );
}

export default CodeV2;