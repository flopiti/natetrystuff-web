//DESC: This file provides utility functions for handling projects, JSON data, and date formatting.
import { ProjectFile } from "@/types/project";

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
export const unescapeString = (str: string) => {
    return str.replace(/\\n/g, '\n').replace(/\\"/g, '"');
}
  
export const fetchHighlightedFilesContent = async (highlightedFiles: any[], projectName: any) => {
    const filesContentPromises = highlightedFiles.map((fileName: any) => getFile(fileName, projectName));
    const filesContent = await Promise.all(filesContentPromises);
    return filesContent;
};

export const replaceCode = async (projectName: any, chatCodes: ProjectFile[]) => {
    const response = await fetch('/api/replace-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project: projectName, files: chatCodes })
    });
    if (!response.ok) {
        throw new Error('Failed to replace code');
    }
};

export const getTopLevelKeys = (jsonString: string): string[] => {
    const keys: string[] = [];
    let inString = false;
    let stringChar = '';
    let escapeNextChar = false;
    let nestingLevel = 0;
    let keyBuffer = '';
    let collectingKey = false;
    let expectingColon = false;
    let i = 0;

    while (i < jsonString.length) {
        const char = jsonString[i];

        if (inString) {
            if (escapeNextChar) {
                escapeNextChar = false;
                if (collectingKey) {
                    keyBuffer += char;
                }
            } else if (char === '\\') {
                escapeNextChar = true;
                if (collectingKey) {
                    keyBuffer += char;
                }
            } else if (char === stringChar) {
                inString = false;
                if (collectingKey) {
                    collectingKey = false;
                    expectingColon = true;
                }
            } else {
                if (collectingKey) {
                    keyBuffer += char;
                }
            }
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                if (nestingLevel === 1 && !collectingKey && !expectingColon) {
                    collectingKey = true;
                    keyBuffer = '';
                }
            } else if (char === '{' || char === '[') {
                nestingLevel++;
            } else if (char === '}' || char === ']') {
                nestingLevel--;
            } else if (char === ':') {
                if (expectingColon) {
                    keys.push(keyBuffer);
                    keyBuffer = '';
                    expectingColon = false;
                }
            } else if (char === ',') {
                expectingColon = false;
                collectingKey = false;
            } else if (nestingLevel === 1 && collectingKey && !char.match(/\s/)) {
                keyBuffer += char;
            }
        }

        i++;
    }

    return keys;
}

export const getTopLevelArrayElements = (jsonString: string): string[] => {
    const elements: string[] = [];
    let inString = false;
    let stringChar = '';
    let escapeNextChar = false;
    let nestingLevel = 0;
    let valueBuffer = '';
    let i = 0;

    // Skip leading whitespace
    while (i < jsonString.length && jsonString[i].match(/\s/)) {
        i++;
    }

    // Check that the first non-whitespace character is '['
    if (jsonString[i] !== '[') {
        throw new Error('Invalid JSON array: does not start with [');
    }
    nestingLevel++; // Starting from '['
    i++;

    while (i < jsonString.length) {
        const char = jsonString[i];

        if (inString) {
            if (escapeNextChar) {
                escapeNextChar = false;
                valueBuffer += char;
            } else if (char === '\\') {
                escapeNextChar = true;
                valueBuffer += char;
            } else if (char === stringChar) {
                inString = false;
                valueBuffer += char;
            } else {
                valueBuffer += char;
            }
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                valueBuffer += char;
            } else if (char === '{' || char === '[') {
                nestingLevel++;
                valueBuffer += char;
            } else if (char === '}' || char === ']') {
                valueBuffer += char;
                nestingLevel--;
                if (nestingLevel === 1 && (char === '}' || char === ']')) {
                    // End of value
                    elements.push(valueBuffer.trim());
                    valueBuffer = '';
                } else if (nestingLevel === 0) {
                    // End of array
                    break;
                }
            } else if (char === ',') {
                if (nestingLevel === 1) {
                    // End of value
                    if (valueBuffer.trim() !== '') {
                        elements.push(valueBuffer.trim());
                        valueBuffer = '';
                    }
                } else {
                    valueBuffer += char;
                }
            } else if (!char.match(/\s/)) {
                valueBuffer += char;
            } else {
                if (valueBuffer.length > 0) {
                    valueBuffer += char;
                }
            }
        }

        i++;
    }

    // If we are still collecting a value at the end
    if (valueBuffer.trim() !== '') {
        elements.push(valueBuffer.trim());
    }

    return elements;
}

export const removeQuotes = (str: string): string => {
    if (str.startsWith('"')) {
        str = str.substring(1);
    }
    if (str.endsWith('"')) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

export const getTopLevelValues = (jsonString: string): string[] => {
    const values: string[] = [];
    let inString = false;
    let stringChar = '';
    let escapeNextChar = false;
    let nestingLevel = 0;
    let collectingValue = false;
    let valueBuffer = '';
    let i = 0;

    while (i < jsonString.length) {
        const char = jsonString[i];

        if (inString) {
            if (escapeNextChar) {
                escapeNextChar = false;
                if (collectingValue) valueBuffer += char;
            } else if (char === '\\') {
                escapeNextChar = true;
                if (collectingValue) valueBuffer += char;
            } else if (char === stringChar) {
                inString = false;
                if (collectingValue) valueBuffer += char;
            } else {
                if (collectingValue) valueBuffer += char;
            }
        } else {
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                if (collectingValue) valueBuffer += char;
            } else if (char === '{' || char === '[') {
                if (collectingValue) valueBuffer += char;
                nestingLevel++;
            } else if (char === '}' || char === ']') {
                if (collectingValue) valueBuffer += char;
                nestingLevel--;
                if (collectingValue && nestingLevel === 1) {
                    // End of value
                    values.push(valueBuffer.trim());
                    valueBuffer = '';
                    collectingValue = false;
                }
            } else if (char === ':') {
                if (nestingLevel === 1) {
                    collectingValue = true;
                    valueBuffer = '';
                } else if (collectingValue) {
                    valueBuffer += char;
                }
            } else if (char === ',') {
                if (collectingValue && nestingLevel === 1) {
                    // End of value
                    values.push(valueBuffer.trim());
                    valueBuffer = '';
                    collectingValue = false;
                } else if (collectingValue) {
                    valueBuffer += char;
                }
            } else {
                if (collectingValue) valueBuffer += char;
            }
        }``

        i++;
    }

    // If we are still collecting a value at the end
    if (collectingValue && valueBuffer.trim() !== '') {
        values.push(valueBuffer.trim());
    }

    return values.map(removeQuotes);
}
