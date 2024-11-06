import React, { useState, useEffect } from "react";
import { embedFile, getAllNodes } from '@/services/chatService';
import { Project } from "@/types/project";
import { getFile } from "@/app/utils";
import { get } from "http";

export interface SystemDashboardProps {
  project: Project;
}

const SystemDashboard = ({ project }: SystemDashboardProps) => {
  const [files, setFiles] = useState<any>([]);
  const [nodes, setNodes] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/file-descriptions?project=${project.name}`
        );
        const response_ = await response.json();
        setFiles(response_.data);
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
    files.forEach((file: any) => {
      nodes.length > 1 && nodes.forEach((node: any) => {
        if (node?.metadata?.fileName === file.name) {
          setFiles((prevFiles: any) => {
            return prevFiles.map((prevFile: any) => {
              if (prevFile.name === file.name) {
                return { ...prevFile, node: node };
              }
              return prevFile;
            });
          }
          );
        }
      });
    });
  }, [nodes]);



  const handleEmbedFile = async (fileName:string) => {
    embedFile(fileName, await getFile(fileName, project.name),  project.name);
  }

  return (
    <div className="w-full bg-blue-200 flex flex-col h-full overflow-y-scroll text-black text-xs p-2">
      {files.map((file: any, index: number) => (
        <div
          key={index}
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
