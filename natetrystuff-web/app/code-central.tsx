import { useEffect, useState } from 'react';
import { Diff, diffLines } from 'diff';

const CodeCentral = () => {
    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "code": the code snippet that you think is the answer}. If the code is not a coding solution,
    simply do not include the property in the JSON object.`;
    
    const [projectFiles, setProjectFiles] = useState<any[]>([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>('');
    const [conversation, setConversation] = useState([{ content: PROMPT, role: 'system', type: 'text' }]);
    const [activeTab, setActiveTab] = useState('file'); // Default to showing file
    const [chatCode, setChatCode] = useState('');

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

    const handleSelectedProjectChange = (event:any) => {
        const pr = projects.find(project => project.name === event.target.value);
        setSelectedProject(pr);
    };

    const getProjectFiles = async () => {
        const res = await fetch(`api/get-all-filenames?project=${selectedProject.name}&type=${selectedProject.type}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
        });

        const files = await res.json();
        console.log(files.data);
        setProjectFiles(files.data);
    }

    useEffect(() => {
        getProjects();
    }, [])

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            askChat();
        }
    }, [conversation])

    useEffect(() => {
        if (selectedProject) {
            getProjectFiles();
        }
    }, [selectedProject])

    useEffect(() => {
        // Reset chat code when selectedFileContent changes
        setChatCode('');
    }, [selectedFileContent])

    const askChat = async () => {
        const messages = conversation.map((message) => {
            return { role: message.role, content: message.content, type: 'text' };
        });
        const lastMessage = messages[messages.length - 1];
        messages.pop();
        messages.push({ content: lastMessage.content + ` The code is: ${selectedFileContent}`, role: 'user', type: 'text' });
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
        setChatCode(JSON.parse(response.chatCompletion.choices[0].message.content).code);
    }

    const addToConversation = (message:any) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    }

    const getFile = async (fileName:any, project:any) => {
        const res = await fetch(`api/get-file?fileName=${fileName}&project=${project}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
        });
        const data = await res.json();
        return data.data;
    }

    const handleFileSelect = async (fileName:any) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
    };

    const replaceCode = async () => {
        await fetch('/api/replace-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName: selectedFileName, code: chatCode, project: selectedProject.name }),
        });
    }

    const getHighlightedCode = () => {
        const diff = diffLines(selectedFileContent, chatCode);
        return diff.map((part:any, index:number) => {
            const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
            return <span key={index} style={style}>{part.value}</span>;
        });
    }

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <div className="w-1/5 bg-gray-100 text-black">
                <div className="sticky top-0 bg-gray-100">
                    <select value={selectedProject} onChange={handleSelectedProjectChange} className="w-full p-2">
                        {projects.map(project => (
                            <option key={project.name} value={project.name}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="h-full overflow-auto">
                    {projectFiles.length > 0 && projectFiles.map((projectFile:any, index:number) => {
                        return (
                            <div key={index} onClick={() => handleFileSelect(projectFile)} className="p-2 cursor-pointer hover:bg-gray-200">
                                <p style={{ fontWeight: selectedFileName === projectFile ? 'bold' : 'normal' }}>
                                    {projectFile}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-1/2 bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
                <div className="flex bg-gray-100 p-2">
                    <button
                        className={`flex-1 text-center p-2 ${activeTab === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('file')}
                    >
                        File
                    </button>
                    <button
                        className={`flex-1 text-center p-2 ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                        onClick={() => setActiveTab('chat')}
                    >
                        Chat
                    </button>
                </div>
                <div className="w-full bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
                    {activeTab === 'file' && selectedFileContent && (
                        <div>
                            <pre>{selectedFileContent}</pre>
                        </div>
                    )}
                    {activeTab === 'chat' && chatCode && (
                        <div>
                            <pre className="w-full">{getHighlightedCode()}</pre>
                            <button
                                className="bg-blue-500 text-white p-2"
                                onClick={replaceCode}
                            >Replace code</button>
                        </div>
                    )}
                </div>
            </div>
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