import React, { useState, useEffect } from "react";
import { getAllNodes } from '@/services/chatService';

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

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodes = await getAllNodes();
        console.log("All nodes:", nodes);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };
    fetchNodes();
  }, []);

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
        </div>
      ))}
    </div>
  );
};

export default SystemDashboard;
