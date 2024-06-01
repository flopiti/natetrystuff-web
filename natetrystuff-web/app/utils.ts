import { LinesOptions, Change, Callback, CallbackOptions } from "diff";
import { SetStateAction } from "react";

export const getProjects = async (setProjects: { (value: SetStateAction<never[]>): void; (arg0: any): void; }) => {
    const res = await fetch('api/get-projects', {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });

    const projects_ = await res.json();
    setProjects(projects_.data);
}

export const getProjectFiles = async (selectedProject: any, setProjectFiles: { (value: SetStateAction<never[]>): void; (arg0: any): void; }) => {
    if (!selectedProject) return;
    const res = await fetch(`api/get-all-filenames?project=${selectedProject.name}&type=${selectedProject.type}`, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        },
    });

    const files = await res.json();
    setProjectFiles(files.data);
}

export const askChat = async (conversation: any[], setConversation: { (value: SetStateAction<{ content: string; role: string; type: string; }[]>): void; (arg0: any[]): void; }, setChatCodes: { (value: SetStateAction<never[]>): void; (arg0: any): void; }, highlightedFiles: any[], highlightedFilesContent: never[]) => {
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
    setConversation([...conversation, {
        content: JSON.parse(response.chatCompletion.choices[0].message.content).answer,
        role: 'assistant',
        type: 'text'
    }]);
    setChatCodes(JSON.parse(response.chatCompletion.choices[0].message.content).files);
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

export const fetchHighlightedFilesContent = async (highlightedFiles: any[], projectName: any, setHighlightedFilesContent: any) => {
    const filesContentPromises = highlightedFiles.map((fileName: any) => getFile(fileName, projectName));
    const filesContent = await Promise.all(filesContentPromises);
    setHighlightedFilesContent(filesContent);
};

export const replaceCode = async (projectName: any, chatCodes: never[]) => {
    await fetch('/api/replace-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: projectName, files: chatCodes })
    });
};



export const handleFlightClick = (fileName: any, event: { shiftKey: any; }, setHighlightedFiles: { (value: SetStateAction<never[]>): void; (arg0: (prev: any) => any): void; }, handleFileSelect: { (fileName: any): Promise<void>; (arg0: any): void; }, highlightedFiles: never[]) => {
    if (event.shiftKey) {
        setHighlightedFiles((prev: any[]) =>
            prev.includes(fileName) ? prev.filter((flight: any) => flight !== fileName) : [...prev, fileName]
        );
    } else {
        handleFileSelect(fileName);
    }
}