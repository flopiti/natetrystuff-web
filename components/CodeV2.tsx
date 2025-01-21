// Front-end Good Practice: https://web.dev/learn/
import { ProjectPath } from "@/interfaces/project";import { getAllPineconeNode,getAllProjects,getLatestPrompt,getProjectFiles } from "@/services/mainService";import { fetchProjectPaths } from "@/services/projectPathService";import { Project } from "@/types/project";import { useEffect,useState } from "react";import Dropdown from "./UI/Dropdown";import { AnimatePresence,motion } from 'framer-motion';import React from "react";import Loader from "./UI/Loader";import CustomButton from "./UI/CustomButton";import RichTextBox from "./UI/RichText";

interface Prompt{promptId:number;promptText:string;creationDate:string;}

const CodeV2=()=>{
  const[allProjects,setAllProjects]=useState<Project[]>([]),[projectPath,setProjectPath]=useState<string|null>(null),
        [selectedProject,setSelectedProject]=useState<Project|null>(null),[files,setFiles]=useState<string[]>([]),
        [nodes,setNodes]=useState<any[]>([]),[prompt,setPrompt]=useState<Prompt|null>(null),[showPrompt,setShowPrompt]=useState<boolean>(false);
  const handlePromptSubmit=(text:string)=>{console.log('Prompt submitted:',text);setShowPrompt(false);};
  const handleSelectProject=(project:Project)=>{setSelectedProject(project);};
  const handleEmbed=()=>{console.log('Embed');};
  const handleReembed=()=>{console.log('Reembed');};

  useEffect(()=>{fetchProjectPaths().then((data:ProjectPath[])=>{setProjectPath(data[0].path);});},[]);
  useEffect(()=>{if(!projectPath)return;getAllProjects(projectPath).then((projects:Project[])=>{setAllProjects(projects);});},[projectPath]);
  useEffect(()=>{if(!selectedProject)return;getProjectFiles(selectedProject).then((files:any[])=>{setFiles(files);});getAllPineconeNode().then((nodes:any)=>{setNodes(nodes.matches);});},[selectedProject]);
  useEffect(()=>{getLatestPrompt().then((prompt:any)=>{setPrompt(prompt);});},[]);

  return(
    <div className="font-Orbitron flex flex-col items-center">
      <div className="flex justify-center">
        <Dropdown<Project> onSelect={handleSelectProject} selectedOption={selectedProject} options={allProjects} labelKey='name' />
      </div>
      {selectedProject && (
        <div  className="flex flex-col items-center">
          <div className="flex justify-center items-center gap-10 my-10"> 
            <Loader loading={false}/>
            <span className="text-sm">{`${nodes?.length} / ${files?.length} embedded`}</span>
            <span className="flex">
              <CustomButton onClick={()=>handleEmbed()}>Embed</CustomButton>
              <CustomButton className="-ml-[0.0625rem]" onClick={()=>handleReembed()}>Re-embed</CustomButton>
              <CustomButton className="-ml-[0.0625rem]" onClick={()=>setShowPrompt(!showPrompt)}>Prompt</CustomButton>
            </span>                
          </div>
          <AnimatePresence>
            {showPrompt && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                exit={{ opacity: 0, y: -20 }}
              >
                <RichTextBox text={prompt?.promptText || null} handleSubmit={handlePromptSubmit}/>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CodeV2;
