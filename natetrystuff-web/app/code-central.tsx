import { useEffect, useState } from 'react';
import { Diff, diffLines } from 'diff';
import FileViewer from './components/FileViewer';
import FileListDropdown from './components/FileListDropdown';

const CodeCentral = () => {
    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] 
    the code snippet that you think is the answer}. You are allowed to create new files if necessary. If the code is not a coding solution, simply do not include the property in the JSON object.`;
    
    const [projectFiles, setProjectFiles] = useState<any[]>([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [conversation, setConversation] = useState([{ content: PROMPT, role: 'system', type: 'text' }]);
    const [activeTab, setActiveTab] = useState('file'); // Default to showing file
    const [chatCodes, setChatCodes] = useState([]); // Change state to an array
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<string[]>([]);
    const [selectedChatCode, setSelectedChatCode] = useState(''); // Add state to store selected chat code

    const getProjects = async () => {
        const res = await fetch('api/get-projects', {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
        });

        const projects_ = await res.json();
        setProjects(projects_.data);
    }

    const getProjectFiles = async () => {
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

    useEffect(() => {
        getProjects();
    }, []);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            askChat();
        }
    }, [conversation]);

    useEffect(() => {
        if (selectedProject) {
            getProjectFiles();
        }
    }, [selectedProject]);

    const askChat = async () => {
        const messages = conversation.map((message) => {
            return { role: message.role, content: message.content, type: 'text' };
        });
        const lastMessage = messages[messages.length - 1];
        messages.pop();
        const highlightedFilesMap = highlightedFiles.reduce((acc, fileName, index) => ({
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

    const addToConversation = (message: any) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    }

    const getFile = async (fileName: any, project: any) => {
        const res = await fetch(`api/get-file?fileName=${fileName}&project=${project}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
        });
        const data = await res.json();
        return data.data;
    }

    const handleFileSelect = async (fileName: any) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
        const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === fileName);
        if (chatCode) {
            setSelectedChatCode(chatCode.code);
        }
    };

    const fetchHighlightedFilesContent = async () => {
        const filesContentPromises = highlightedFiles.map(fileName => getFile(fileName, selectedProject.name));
        const filesContent = await Promise.all(filesContentPromises);
        setHighlightedFilesContent(filesContent);
    };

    const replaceCode = async () => {
        await fetch('/api/replace-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ project: selectedProject.name, files: chatCodes })
        });
    }

    const getHighlightedCode = (fileCode: any) => { // Accept parameter to get respective chat code
        const diff = diffLines(selectedFileContent, fileCode);
        return diff.map((part: any, index: number) => {
            const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
            return <span key={index} style={style}>{part.value}</span>;
        });
    }

    const handleFlightClick = (fileName: string, event: any) => {
        if (event.shiftKey) {
            setHighlightedFiles((prev) =>
                prev.includes(fileName) ? prev.filter((flight) => flight !== fileName) : [...prev, fileName]
            );
        } else {
            handleFileSelect(fileName);
        }
    }

    useEffect(() => {
        if (highlightedFiles.length > 0) {
            fetchHighlightedFilesContent();
        }
    }, [highlightedFiles]);

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <FileListDropdown
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                projectFiles={projectFiles}
                handleFlightClick={handleFlightClick}
                selectedFileName={selectedFileName}
                highlightedFiles={highlightedFiles}
                chatCodes={chatCodes}
                setSelectedChatCode={setSelectedChatCode}
            />
            <FileViewer 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                selectedFileContent={selectedFileContent} 
                selectedChatCode={selectedChatCode} 
                selectedFileName={selectedFileName} 
                setSelectedChatCode={setSelectedChatCode} 
                replaceCode={replaceCode}
                getHighlightedCode={getHighlightedCode}
            />
            <div className="w-[30%] bg-red-200 h-full flex flex-col">
                <div className="w-full h-4/5 bg-yellow-200 overflow-scroll">
                    {conversation?.slice(1).map((message, index) => (
                        <div key={index} className={`text-black ${message.role === 'user' ? 'text-right' : 'text-left'}`}> 
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full h-1/5 bg-purple-200">
                    <input type="text" className="w-full h-full text-black"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                addToConversation(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }} />
                </div>
            </div>
        </div>
    );
}

export default CodeCentral;
