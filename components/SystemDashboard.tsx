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
  const [embedStatus, setEmbedStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchData = async () => {
      console.log('FETCHING ALL FILES')
      try {
        const data = await getProjectFiles(project);
        const formattedData = data.map((file: any) => ({ name: file }));
        setFiles(formattedData);
      } catch (error) {
        console.error("Error fetching file descriptions:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodes = await getAllNodes();
        setNodes(nodes.matches);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };
    fetchNodes();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      setFiles((prevFiles) => {
        return prevFiles.map((file) => {
          const matchingNode = nodes.find(node => node?.metadata?.fileName === file.name);
          if (matchingNode) {
            return { ...file, node: matchingNode };
          }
          return file;
        });
      });
    }
  }, [nodes]);

  const handleEmbedFile = async (fileName: string) => {
    try {
      const fileContent = await getFile(fileName, project.name);
      await embedFile(fileName, fileContent, project.name);
      setEmbedStatus(prevStatus => ({ ...prevStatus, [fileName]: true }));
      // Re-fetch nodes after embedding to ensure updated state
      await fetchNodes();
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
          {!file.node ? (
            <button onClick={() => handleEmbedFile(file.name)}>
              Get It
            </button>
          ) : (
            <span className="text-green-600">Embedded</span>
          )}

          {embedStatus[file.name] && (
            <span className="text-green-500">Embedding Completed!</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SystemDashboard;