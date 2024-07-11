import { LinesOptions, Change, Callback, CallbackOptions } from "diff";

export const getProjects = async () => {
    const res = await fetch('api/get-projects', {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });

    const projects_ = await res.json();
    return projects_.data;
}

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

export const askChat = async (conversation: any[], highlightedFiles: any[], highlightedFilesContent: any[]) => {
    const messages = conversation.map((message: { role: any; content: any; }) => {
        return { role: message.role, content: message.content, type: 'text' };
    });
    const lastMessage = messages[messages.length - 1];
    messages.pop();
    const highlightedFilesMap = highlightedFiles.reduce((acc: any, fileName: any, index: any) => ({
        ...acc,
        [fileName]: highlightedFilesContent[index]
    }), {});
    const highlightedFilesText = JSON.stringify(highlightedFilesMap);
    messages.push({ content: lastMessage.content + ` The code is: ${highlightedFilesText}`, role: 'user', type: 'text' });
    const res = await fetch('api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify({ messages })
    });

    const response = await res.json();
    console.log(response.chatCompletion);
    return JSON.parse(response.chatCompletion.choices[0].message.content);
}

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