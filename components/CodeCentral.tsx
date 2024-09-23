import { useEffect, useState } from 'react';
import FileViewer from './FileViewer';
import FileListDropdown from './FileListDropdown';
import TerminalDisplay from './TerminalDisplay';
import { fetchHighlightedFilesContent, getFile, getProjectFiles, getProjects, handleFlightClick, replaceCode } from '../app/utils';

const CodeCentral = () => {
    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] THE ENTIRE RESPONSE MUST BE JSON.
    the code snippet that you think is the answer}. You are allowed to create new files if necessary.
    If you return a code file, you return the same file name as the original file name exactly and EXACTLY the same code as the original code (apart from the changes you made). 
    If the code is not a coding solution, simply do not include the property in the JSON object.`;
    
    const [projectFiles, setProjectFiles] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [conversation, setConversation] = useState<{ content: string, role: string, type: string }[]>([{ content: PROMPT, role: 'system', type: 'text' }]);
    const [activeTab, setActiveTab] = useState<string>('file'); // Default to showing file
    const [chatCodes, setChatCodes] = useState<any[]>([]); // Change state to an array
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [selectedChatCode, setSelectedChatCode] = useState<string>(''); // Add state to store selected chat code
    const [splitFileData, setSplitFileData] = useState<string>(''); 
    const [loading, setLoading] = useState<boolean>(false);
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen); 
    const[dirPath, setDirPath] = useState<string>('');

    useEffect(() => {
        if (dirPath.length > 1) {
            getProjects(dirPath).then((data) => {
                setProjects(data);
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }, [dirPath]);

    useEffect(() => {
        setChatCodes((prevChatCodes) => {
            const newChatCodes = prevChatCodes.map((chatCode) => {
                if (chatCode.fileName === selectedFileName) {
                    return { fileName: selectedFileName, code: selectedChatCode };
                }
                return chatCode;
            });
            return newChatCodes;
        }
        );

    }, [selectedChatCode,selectedFileName] );

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            setLoading(true); // Start loading
            askChat(conversation, highlightedFiles, highlightedFilesContent);
                // setConversation([...conversation, { content: response.answer, role: 'assistant', type: 'text' }]);
                // setChatCodes(response.files);
                // setLoading(false); // End loading
            
        }
    }, [conversation, highlightedFiles, highlightedFilesContent]);

    useEffect(() => {
        if (selectedProject) {
            (async () => {
                const data = await getProjectFiles(selectedProject);
                setProjectFiles(data);
            })();
        }
    }, [selectedProject]);

    useEffect(() => {
        if (chatCodes?.length > 0) {
            setActiveTab('chat'); // Switch to Chat tab when new chat codes are added
            const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === selectedFileName);
            if (chatCode) {
                setSelectedChatCode(chatCode.code);
            }
        }
    }, [chatCodes, selectedFileName]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    };

    function getTopLevelKeys(jsonString: string): string[] {
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
    
    function getTopLevelValues(jsonString: string): string[] {
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
            }
    
            i++;
        }
    
        // If we are still collecting a value at the end
        if (collectingValue && valueBuffer.trim() !== '') {
            values.push(valueBuffer.trim());
        }
    
        return values;
    }
    
    
    const askChat = async (conversation: any[], highlightedFiles: any[], highlightedFilesContent: any[]) => {
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
    
        console.log(messages);
        const response = await fetch('api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({ messages })
        });
    
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let chatCompletion = '';
    
        while (!done) {
            const { value, done: doneReading } = await reader?.read()!;
            done = doneReading;
            const chunk = decoder.decode(value, { stream: true });
            chatCompletion += chunk;            
            let buffer = '';
            try {
                // console.log(chatCompletion);
                const jsonStartIndex = chatCompletion.indexOf('{');
                
                if (jsonStartIndex !== -1) {
                
                    buffer += chatCompletion.substring(jsonStartIndex);
                    console.log(buffer);
                    const valueMatches = buffer.match(/:\s*("[^"]*"|[^,{}[\]]+)/g);
                    const keyMatches = buffer.match(/"[^"]*"\s*:/g);
                    // console.log(valueMatches);
                    // console.log(keyMatches);

                    console.log(getTopLevelKeys(buffer));
                    console.log(getTopLevelValues(buffer));
                    if (valueMatches) {
                        valueMatches.forEach((value, index) => {
                            let fieldValue = value.split(':')[1].trim().replace(/^"|"$/g, '');

                            if(index + 1 === 1){
                                setConversation([...conversation, { content: fieldValue, role: 'assistant', type: 'text' }]);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing JSON chunk:', error);
            }
            setLoading(false); // End loading
        }

        // console.log('completed');
        // console.log(JSON.parse(chatCompletion))
        setChatCodes(JSON.parse(chatCompletion).files);

    
        return "";
        // console.log(chatCompletion);
        // return JSON.parse(chatCompletion);
    }

    const handleFileSelect = async (fileName: string) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
        const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === fileName);
        if (chatCode) {
            setSelectedChatCode(chatCode.code);
        }
        const fileDataResponse = await fetch(`/api/get-file?fileName=${fileName}&project=${selectedProject.name}`);
        const { splitFileData } = await fileDataResponse.json();

        setSplitFileData(splitFileData);

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
    }, [highlightedFiles,selectedProject]);

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <FileListDropdown
                setDirPath={setDirPath}
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
                setSelectedChatCode={setSelectedChatCode} // Pass the state function down to FileViewer
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                selectedFileContent={selectedFileContent} 
                selectedChatCode={selectedChatCode} 
                selectedFileName={selectedFileName} 
                replaceCode={() => replaceCode(selectedProject.name, chatCodes)} 
                loading={loading} // Pass loading state to FileViewer
            />
            <div className="w-[40%] bg-red-200 h-full flex flex-col">
                <div className="w-full flex-grow bg-yellow-200 overflow-scroll">
                    {loading && <p className="text-center text-black">Loading...</p>} {/* Show loading message */}
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
            <div id='terminal-window' className={`${isTerminalOpen ? '' :'hidden'}`}>
                <TerminalDisplay/>
            </div>
            
            <button onClick={toggleTerminal}>{isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}</button>
 
        </div>
    );
}

export default CodeCentral;
