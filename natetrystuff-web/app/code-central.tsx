import { SetStateAction, useEffect, useState } from 'react';
import { Callback, CallbackOptions, Change, LinesOptions, diffLines } from 'diff';
import FileViewer from './components/FileViewer';
import FileListDropdown from './components/FileListDropdown';
import { getProjects, getProjectFiles, askChat, getFile, fetchHighlightedFilesContent, replaceCode, handleFlightClick } from './utils';

const CodeCentral = () => {
    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] 
    the code snippet that you think is the answer}. You are allowed to create new files if necessary. If the code is not a coding solution, simply do not include the property in the JSON object.`;
    
    const [projectFiles, setProjectFiles] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [conversation, setConversation] = useState([{ content: PROMPT, role: 'system', type: 'text' }]);
    const [activeTab, setActiveTab] = useState('file'); // Default to showing file
    const [chatCodes, setChatCodes] = useState([]); // Change state to an array
    const [highlightedFiles, setHighlightedFiles] = useState<any>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any>([]);
    const [selectedChatCode, setSelectedChatCode] = useState(''); // Add state to store selected chat code

    useEffect(() => {
        (async () => {
            const data = await getProjects();
            setProjects(data);
        })();
    }, []);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            (async () => {
                const response = await askChat(conversation, highlightedFiles, highlightedFilesContent);
                setConversation([...conversation, { content: response.answer, role: 'assistant', type: 'text' }]);
                setChatCodes(response.files);
            })();
        }
    }, [conversation]);

    useEffect(() => {
        if (selectedProject) {
            (async () => {
                const data = await getProjectFiles(selectedProject);
                setProjectFiles(data);
            })();
        }
    }, [selectedProject]);

    useEffect(() => {
        if (chatCodes.length > 0) {
            setActiveTab('chat'); // Switch to Chat tab when new chat codes are added
            const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === selectedFileName);
            if (chatCode) {
                setSelectedChatCode(chatCode.code);
            }
        }
    }, [chatCodes]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    }

    const handleFileSelect = async (fileName: SetStateAction<string>) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
        const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === fileName);
        if (chatCode) {
            setSelectedChatCode(chatCode.code);
        }
        if (!highlightedFiles.includes(fileName)) {
            setHighlightedFiles([...highlightedFiles, fileName]);
        }
    };

    useEffect(() => {
        if (highlightedFiles.length > 0) {
            (async () => {
                const content = await fetchHighlightedFilesContent(highlightedFiles, selectedProject.name);
                setHighlightedFilesContent(content);
            })();
        }
    }, [highlightedFiles]);

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <FileListDropdown
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                projectFiles={projectFiles}
                handleFlightClick={(fileName, event) => setHighlightedFiles((prev: any) => handleFlightClick(fileName, event, prev, handleFileSelect))}
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
                replaceCode={() => replaceCode(selectedProject.name, chatCodes)}
            />
            <div className="w-[30%] bg-red-200 h-full flex flex-col">
                <div className="w-full h-4/5 bg-yellow-200 overflow-scroll">
                    {conversation?.slice(1).map((message, index) => (
                        <div key={index} className={`text-black ${message.role === 'user' ? 'text-right' : 'text-left'}`}> 
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full h-1/5 bg-purple-20">
                    <textarea className="w-full h-full text-black p-2 whitespace-pre-wrap break-words"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                addToConversation(e.currentTarget.value);
                                e.currentTarget.value = '';
                                e.preventDefault(); 
                            }
                        }} />
                </div>
            </div>
        </div>
    );
}

export default CodeCentral;
