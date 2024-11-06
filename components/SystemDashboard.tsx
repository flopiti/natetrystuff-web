import React, { useState, useEffect } from "react";
import { embedFile, getAllNodes } from '@/services/chatService';
import { Project } from "@/types/project";
import { getFile, getProjectFiles } from "@/app/utils";

export interface SystemDashboardProps {
  project: Project;
}

const SystemDashboard = ({ project }: SystemDashboardProps) => {
  const [files, setFiles] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjectFiles(project);
        const formattedData = data.map((file: any) => ({ name: file }));
        setFiles(formattedData);
      } catch (error) {
        console.error("Error fetching file descriptions:", error);
      }
    };
    fetchData();
  }, [project]);

  useEffect(() => {
    const fetchNodes = async () => {
      console.log('about to fetch nodes')
      try {
        const nodesData = await getAllNodes();
        console.log('received nodes')
        setNodes(nodesData.matches);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };
    fetchNodes();
  }, []);

  useEffect(() => {
    console.log('nodes?? ' )
    console.log(nodes)
    const nodeMap = new Map(nodes.map((node: any) => [node.metadata.fileName, node]));

    console.log("Files with nodes:", files.filter(file => file.node));
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({
        ...file,
        node: nodeMap.get(file.name) || file.node,
      }))
    );
  }, [nodes]);

  const handleEmbedFile = async (fileName: string) => {
    try {
      const fileContent = await getFile(fileName, project.name);
      await embedFile(fileName, fileContent, project.name);
    } catch (error) {
      console.error("Error embedding file:", error);
    }
  };

  return (
    <div className="w-full bg-blue-200 flex flex-col h-full overflow-y-scroll text-black text-xs p-2">
      {files.map((file) => (
        <div
          key={file.name}
          className="file-item p-2 border rounded bg-gray-200 text-black flex items-center justify-between space-x-4"
        >
          <div className="file-name font-bold flex-1 truncate overflow-hidden whitespace-nowrap">
            {file.name}
          </div>
          {!file.node && (
            <button onClick={() => handleEmbedFile(file.name)}>
              Get It
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default SystemDashboard;
