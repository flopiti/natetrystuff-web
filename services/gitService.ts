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