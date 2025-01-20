import { get } from "@/app/httpClient";
import { Project } from "@/interfaces/project";

export const getAllProjects = async (dirPath: string): Promise<Project[]> => {
    try {
        const response = await get<Project[]>(`api/get-projects?dirPath=${dirPath}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

export const getProjectFiles = async (selectedProject: Project) => {
    if (!selectedProject) return [];
    const res = await fetch(`api/get-all-filenames?project=${selectedProject.name}&type=${selectedProject.type}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });
    const files = await res.json();
    return files.data;
}