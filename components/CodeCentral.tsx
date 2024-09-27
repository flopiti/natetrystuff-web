import { useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import { ITerminalOptions } from 'xterm';

import FileViewer from './FileViewer';
import FileListDropdown from './FileListDropdown';
import TerminalDisplay from './TerminalDisplay';
import { fetchHighlightedFilesContent, getFile, getProjectFiles, getProjects, getTopLevelArrayElements, getTopLevelKeys, getTopLevelValues, handleFlightClick, replaceCode } from '../app/utils';
import Chat from './Chat';

const CodeCentral = () => {
    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] THE ENTIRE RESPONSE MUST BE JSON.
    the code snippet that you think is the answer}. You are allowed to create new files if necessary.
    If you return a code file, you return the same file name as the original file name exactly and EXACTLY the same code as the original code (apart from the changes you made). 
    If the code is not a coding solution, simply do not include the property in the JSON object.`;
    // Add new state for terminals and selected terminal
    const [terminals, setTerminals] = useState<{ id: number; terminalInstance: Terminal | null; ws: WebSocket | null }[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);

    //loading the file path
    const[dirPath, setDirPath] = useState<string>('');

    //loading projects from the file system
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    //loading project files based on the selected project
    const [projectFiles, setProjectFiles] = useState<string[]>([]);

    //loading the selected file content
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');

    //initializing the conversation
    const [conversation, setConversation] = useState<{ content: string, role: string, type: string }[]>([{ content: PROMPT, role: 'system', type: 'text' }]);
    const [activeTab, setActiveTab] = useState<string>('file'); // Default to showing file
    const [loading, setLoading] = useState<boolean>(false);
    const [messageStreamCompleted, setMessageStreamCompleted] = useState<boolean>(false);

    //loading the chat codes
    const [chatCodes, setChatCodes] = useState<any[]>([]); // Change state to an array
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [selectedChatCode, setSelectedChatCode] = useState<string>(''); // Add state to store selected chat code

    //terminal
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen); 
    
    //branch
    const [branch, setBranch] = useState<string | null>(null);

    const getBranch = async () => {
        console.log('dirPath', dirPath);
        const response = await fetch(`api/current-branch?dirPath=${dirPath}/${selectedProject.name}`);
        const { data } = await response.json();
        setBranch(data.branchName);
    }

    useEffect(() => {
        if (selectedProject) {
            getBranch();
        }
    }, [selectedProject]);

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
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            setLoading(true); // Start loading
            askChat(conversation, highlightedFiles, highlightedFilesContent);
            
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
            setActiveTab('chat'); 
            const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === selectedFileName);
            if (chatCode) {
                setSelectedChatCode(chatCode.code);
            }
        }
    }, [chatCodes]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    };
    const runCommand = (command: any) => {
        const terminal = terminals.find((t) => t.id === selectedTerminal);
        if (terminal && terminal.ws && terminal.ws.readyState === WebSocket.OPEN) {
          console.log("sending command", command);
          console.log(`Sending command to WebSocket with terminal ID: ${selectedTerminal}`);
          terminal.ws.send(JSON.stringify({ type: 'command', id: `session-${selectedTerminal}`, data: command + '\r' }));
        } else {
          console.error('No active terminal selected or WebSocket not connected.');
        }
      };
    
      const runCommandAndGetOutput = async (command: string): Promise<string> => {
        const terminal = terminals.find((t) => t.id === selectedTerminal);
        if (terminal && terminal.ws && terminal.ws.readyState === WebSocket.OPEN) {
          
          return new Promise((resolve, reject) => {
            const sessionId = `session-${selectedTerminal}`;
            const ws = terminal.ws;
            let capture = false;
    
            const handleMessage = (event: MessageEvent) => {
    
              const message = JSON.parse(event.data);
              if(message.data.includes('git branch --show-current')){
                capture = true;
              }
    
    
              if (message.type === 'commandOutput' && message.id === sessionId) {
                ws?.removeEventListener('message', handleMessage);
                resolve(message.data.trim());
              } else if (message.type === 'commandError' && message.id === sessionId) {
                ws?.removeEventListener('message', handleMessage);
                reject(message.error);
              }
            };
    
            ws?.addEventListener('message', handleMessage);
    
            ws?.send(
              JSON.stringify({
                type: 'command',
                id: sessionId,
                data: command + '\r',
              })
            );
          });
        } else {
          console.error('No active terminal selected or WebSocket not connected.');
          return Promise.reject('No active terminal selected or WebSocket not connected.');
        }
      };

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
                const jsonStartIndex = chatCompletion.indexOf('{');                
                if (jsonStartIndex !== -1) {
                    buffer += chatCompletion.substring(jsonStartIndex);
                    const valueMatches = getTopLevelValues(buffer);
                    if (valueMatches) {
                        valueMatches.forEach((value, index) => {
                            if(index + 1 === 1){
                                setConversation([...conversation, { content: value, role: 'assistant', type: 'text' }]);
                            }
                            if(index + 1 === 2){
                                const files = getTopLevelArrayElements(value);
                                let arrayElementsValues = files.map((element) => {
                                    return getTopLevelValues(element);
                                });
                                arrayElementsValues.forEach((element) => {
                                    setChatCodes([...chatCodes, { fileName: element[0], code: element[1] ? element[1]:'' }]);
                                });
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing JSON chunk:', error);
            }
        }
        setLoading(false);

        setChatCodes(JSON.parse(chatCompletion).files);

    
        return  
    }

    const handleFileSelect = async (fileName: string) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName, selectedProject.name);
        setSelectedFileContent(content);
        const chatCode: any = chatCodes?.find((fileData: any) => fileData.fileName === fileName);
        if (chatCode) {
            setSelectedChatCode(chatCode.code);
        }
        else{
            setSelectedChatCode('');
        }
        const fileDataResponse = await fetch(`/api/get-file?fileName=${fileName}&project=${selectedProject.name}`);
        const { splitFileData } = await fileDataResponse.json();


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
        <div className="h-[70vh] border-2 border-white w-full flex flex-col">
            <div>
                {branch && <p>Current Branch: {branch}</p>}
            </div>
            <div className="flex h-full flex-row w-full">
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
                <Chat addToConversation={addToConversation} conversation={conversation} loading={loading} setMessages={setConversation} />
            <div id='terminal-window' className={`${isTerminalOpen ? '' :'hidden'}`}>
            <TerminalDisplay
                terminals={terminals}
                setTerminals={setTerminals}
                selectedTerminal={selectedTerminal}
                setSelectedTerminal={setSelectedTerminal}
                runCommand={runCommand}
                runCommandAndGetOutput={runCommandAndGetOutput}
            />            </div>
            <button onClick={toggleTerminal}>{isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}</button>
            </div>

        </div>
    );
}

export default CodeCentral;
