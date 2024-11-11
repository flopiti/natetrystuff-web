export const dynamic = 'force-dynamic'
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
  const [embedStatus, setEmbedStatus] = useState<{ [key: string]: string }>({});

  const fetchNodes = async () => {
    try {
      console.log('Fetching nodes...'); // Log fetching nodes
      const nodes = await getAllNodes();
      setNodes(nodes.matches);
      console.log('Fetched nodes:', nodes.matches);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('FETCHING ALL FILES');
      try {
        const data = await getProjectFiles(project);
        const formattedData = data.map((file: any) => ({ name: file }));
        setFiles(formattedData);
        console.log('Fetched files:', formattedData);
      } catch (error) {
        console.error("Error fetching file descriptions:", error);
      }
    };
    fetchData();
  }, [project]); // Added project dependency to account for different projects

  useEffect(() => {
    console.log('Initial fetch nodes'); // Log initial fetch
    fetchNodes();
  }, []);

  useEffect(() => {
    if (nodes.length > 0) {
      console.log('Updating files with nodes'); // Log file update
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
      console.log(`Embedding file: ${fileName}`); // Log embedding
      setEmbedStatus(prevStatus => ({ ...prevStatus, [fileName]: 'Embedding...' }));
      const fileContent = await getFile(fileName, project.name);
      await embedFile(fileName, fileContent, project.name);
      setEmbedStatus(prevStatus => ({ ...prevStatus, [fileName]: 'Embedding Completed!' }));
      console.log(`File embedded: ${fileName}`);
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
            <span className="text-green-500">{embedStatus[file.name]}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SystemDashboard;
