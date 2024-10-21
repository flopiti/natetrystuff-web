import { getFile } from "@/app/utils";
import { askChatNoStream } from "@/services/chatService";
import { Project } from "@/types/project";
import React, { useState, useEffect } from "react";

export interface SystemDashboardProps {
  project: Project;
}

const SystemDashboard = ({ project }: SystemDashboardProps) => {
  const [files, setFiles] = useState<any>([]);
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

  const handleGetDesc = async (fileName: string) => {
    try {
      getFile(fileName, project.name).then(async (fileContent) => {
        console.log("File Content:", fileContent);
        const initialMessage = {
          role: "user",
          content: `Please return exactly this file, ONLY THIS FILE, but add a comment at the top that begins with eaxctly: //DESC: and then you 
          add a description of the file in a single sentence. For example: //DESC: This file contains the logic for the user login page.
          Here is the the file: ${fileContent}
          The response must be in a JSON with the only field being fileContent`,
        };
        const response = await askChatNoStream([initialMessage]);

        const newFile = response.fileContent;


        

      });
    } catch (error) {
      console.error("Error fetching file description:", error);
    }
  };

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
          <div className="desc flex-1">DESC: {file.DESC}</div>
          {file.DESC === 0 && (
            <button
              className="get-desc-btn flex-none"
              onClick={() => handleGetDesc(file.name)}
            >
              Get a DESC
            </button>
          )}
          <div className="feat flex-1">FEAT: {file.FEAT}</div>
        </div>
      ))}
    </div>
  );
};

export default SystemDashboard;
