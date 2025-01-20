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

export const getProjectFiles = async (selectedProject: Project): Promise<string[]> => {
    if (!selectedProject) return [];
    try {
        const response = await get<string[]>(`api/get-all-filenames?project=${selectedProject.name}&type=${selectedProject.type}`, {
            headers: {
                'Cache-Control': 'no-store'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching project files:', error);
        return [];
    }
}

export const getAllPineconeNode = async () => {
    try {
        const response = await get<any>('/api/get-all-nodes', {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all nodes:', error);
        return [];
    }
};