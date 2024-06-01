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
    const [highlightedFiles, setHighlightedFiles] = useState([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState([]);
    const [selectedChatCode, setSelectedChatCode] = useState(''); // Add state to store selected chat code

    useEffect(() => {
        getProjects(setProjects);
    }, []);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            askChat(conversation, setConversation, setChatCodes, highlightedFiles, highlightedFilesContent);
        }
    }, [conversation]);

    useEffect(() => {
        if (selectedProject) {
            getProjectFiles(selectedProject, setProjectFiles);
        }
    }, [selectedProject]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    }

    const handleFileSelect = async (fileName: SetStateAction<string>) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
        const chatCode:any = chatCodes?.find((fileData:any) => fileData.fileName === fileName);
        if (chatCode) {
            setSelectedChatCode(chatCode.code);
        }
    };

    const getHighlightedCode = (fileCode: any, diffLines: { (oldStr: string, newStr: string, options?: LinesOptions | undefined): Change[]; (oldStr: string, newStr: string, options: Callback | (LinesOptions & CallbackOptions)): void; (arg0: any, arg1: any): any; }, selectedFileContent: string) => { // Accept parameter to get respective chat code
        const diff = diffLines(selectedFileContent, fileCode);
        return diff.map((part: any, index: any) => {
            const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
            return part.value.split('\n').map((line: any, index: any) => {
                return <span key={index} style={style}>{part.value}</span>;
        });
    });
    }

    useEffect(() => {
        if (highlightedFiles.length > 0) {
            fetchHighlightedFilesContent(highlightedFiles, selectedProject.name, setHighlightedFilesContent);
        }
    }, [highlightedFiles]);

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <FileListDropdown
                projects={projects}
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                projectFiles={projectFiles}
                handleFlightClick={(fileName, event) => handleFlightClick(fileName, event, setHighlightedFiles, handleFileSelect, highlightedFiles)}
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
                replaceCode={() => replaceCode(selectedProject.name, chatCodes)}
                getHighlightedCode={(fileCode: any) => getHighlightedCode(fileCode, diffLines, selectedFileContent)}
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