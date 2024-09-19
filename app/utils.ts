import { LinesOptions, Change, Callback, CallbackOptions } from "diff";

export const getProjects = async (dirPath:string) => {
    const res = await fetch(`api/get-projects?dirPath=${dirPath}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });

    const projects_ = await res.json();
    return projects_.data;
}
export const setToMidnight = (date: Date): void => {
    date.setHours(0, 0, 0, 0);
};

export const formatISODate = (date: Date): string => {
    return `${date.toISOString().split('T')[0]}T00:00:00`;
};

export const getProjectFiles = async (selectedProject: any) => {
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



export const fetchAPI = async (url: string, method: string = 'GET', body?: any) => {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
};

export const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

export const getFile = async (fileName: any, project: any) => {
    const res = await fetch(`api/get-file?fileName=${fileName}&project=${project}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });
    const data = await res.json();
    return data.data;
}

export const fetchHighlightedFilesContent = async (highlightedFiles: any[], projectName: any) => {
    const filesContentPromises = highlightedFiles.map((fileName: any) => getFile(fileName, projectName));
    const filesContent = await Promise.all(filesContentPromises);
    return filesContent;
};

export const replaceCode = async (projectName: any, chatCodes: any[]) => {
    await fetch('/api/replace-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: projectName, files: chatCodes })
    });
};

export const handleFlightClick = (fileName: any, event: { shiftKey: any; }, highlightedFiles: any[], handleFileSelect: { (fileName: any): Promise<void>; (arg0: any): void; }) => {
    if (event.shiftKey) {
        return highlightedFiles.includes(fileName) ? highlightedFiles.filter((flight: any) => flight !== fileName) : [...highlightedFiles, fileName];
    } else {
        handleFileSelect(fileName);
    }
    return highlightedFiles;
}