import { useEffect, useState } from 'react';
import { Terminal } from 'xterm';

import FileViewer from './FileViewer';
import FileListDropdown from './FileListDropdown';
import TerminalDisplay from './TerminalDisplay';
import { fetchHighlightedFilesContent, getFile, getProjectFiles, getProjects, getTopLevelArrayElements, getTopLevelValues, handleFlightClick, replaceCode } from '../app/utils';
import Chat from './Chat';
import { useConversation } from '@/hooks/useConversation';

const CodeCentral = () => {

    const{conversation, setConversation} = useConversation();

    const [terminals, setTerminals] = useState<{ id: number; terminalInstance: Terminal | null; ws: WebSocket | null }[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);
    const [devTerminalId, setDevTerminalId] = useState<number | null>(null);
    const [dirPath, setDirPath] = useState<string>('');
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [projectFiles, setProjectFiles] = useState<string[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('file');
    const [loading, setLoading] = useState<boolean>(false);
    const [messageStreamCompleted, setMessageStreamCompleted] = useState<boolean>(false);

    const [chatCodes, setChatCodes] = useState<any[]>([]);
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [selectedChatCode, setSelectedChatCode] = useState<string>('');

    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen); 
    const [branch, setBranch] = useState<string | null>(null);

    const [doesCurrentProjectHaveTerminal, setDoesCurrentProjectHaveTerminal] = useState<boolean>(false);

    const [commitMessage, setCommitMessage] = useState<string>('');
    const [gitDiff, setGitDiff] = useState<any>(null);

    const handleCommitMessageChange = (newMessage: string) => {
        setCommitMessage(newMessage);
    };

    const getBranch = async () => {
        const response = await fetch(`api/current-branch?dirPath=${dirPath}/${selectedProject.name}`);
        const { data } = await response.json();
        setBranch(data.branchName);
    }
    useEffect(() => {
        if (selectedProject && doesCurrentProjectHaveTerminal) {
            const runCommandWithLogging = `cd /dev-projects/${selectedProject.name}`;
            runCommandInCurrentProject(runCommandWithLogging);
        }
    }, [selectedProject, doesCurrentProjectHaveTerminal, terminals]);
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
            setLoading(true);
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

    // Log devTerminalId on every render
    useEffect(() => {
        console.log('Dev Terminal ID during render:', devTerminalId);
    });

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    };

    const runCommand = (command: any) => {
        const terminal = terminals.find((t) => t.id === selectedTerminal);
        if (terminal && terminal.ws && terminal.ws.readyState === WebSocket.OPEN) {
          console.log("sending command", command);
          terminal.ws.send(JSON.stringify({ type: 'command', id: `session-${selectedTerminal}`, data: command + '\r' }));
        } else {
          console.error('No active terminal selected or WebSocket not connected.');
        }
      };
    
    const runCommandInCurrentProject = (command: any) => {
        console.log(`Current devTerminalId before running command:`, devTerminalId);
        const terminal = terminals.find((t) => t.id === devTerminalId);
        console.log(`Found terminal:`, terminal);
        console.log(`Terminal WebSocket ready state:`, terminal?.ws?.readyState);
        if (terminal && terminal.ws) {
            let attempts = 0;
            const maxAttempts = 5;
            setTimeout(() => {
                const interval = setInterval(() => {
                    if (terminal.ws?.readyState === WebSocket.OPEN) {
                        console.log("WebSocket is open, sending command", command);
                        terminal.ws.send(JSON.stringify({ type: 'command', id: `session-${devTerminalId}`, data: command + '\r' }));
                        clearInterval(interval);
                    } else if (terminal.ws?.readyState !== WebSocket.CONNECTING || attempts >= maxAttempts) {
                        console.error('No active terminal for current project or WebSocket not connected.');
                        clearInterval(interval);
                    }
                    attempts++;
                }, 1000);
            }, 1000);
        } else {
            console.error('No active terminal for current project or WebSocket not connected.');
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
    
            ws?.send(JSON.stringify({ type: 'command', id: sessionId, data: command + '\r' }));
          });
        } else {
          console.error('No active terminal selected or WebSocket not connected.');
          return Promise.reject('No active terminal selected or WebSocket not connected.');
        }
      };

    const askChat = async (conversation: any[] , highlightedFiles: any[], highlightedFilesContent: any[]) => {
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

    const askChatNoStream = async (messages: any[]): Promise<any> => {
        const response = await fetch('/api/chat-no-stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Response from chat-no-stream:', data);
            // Handle the response data accordingly
            return data;
            // If there are files, you can update the state to reflect them as well
        } else {
            console.error('Error calling chat-no-stream:', response.statusText);
        }
    };

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
    }, [highlightedFiles, selectedProject]);

    const fetchGitDiff = async () => {
        if (selectedProject) {
            try {
                const response = await fetch(`/api/git-diff?projectName=${selectedProject.name}`);
                const result = await response.json();
                setGitDiff(result);
                console.log('Git Diff Result:', result);
            } catch (error) {
                console.error('Error fetching git diff:', error);
            }
        } else {
            console.error('No project selected.');
        }
    };

    useEffect(() => {
        if (gitDiff && gitDiff.data.diff !== '') {
            console.log('Git Diff:', gitDiff);
            const message = `Please provide a JSON response with the 'answer' field containing the commit message based on these changes: ${gitDiff.data.diff}`;
            askChatNoStream([{ role: 'user', content: message }])
                .then(data => { console.log('Commit Message:', data.answer) });
        }
    }, [gitDiff]);

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
                setSelectedChatCode={setSelectedChatCode}
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                selectedFileContent={selectedFileContent} 
                selectedChatCode={selectedChatCode} 
                selectedFileName={selectedFileName} 
                replaceCode={() => replaceCode(selectedProject.name, chatCodes)} 
                loading={loading}
            />
            <Chat addToConversation={addToConversation} conversation={conversation} loading={loading} setMessages={setConversation} runCommand={runCommandInCurrentProject}  getBranch={getBranch} branch={branch}/>
            <div id='terminal-window' className={`${isTerminalOpen ? '' :'hidden'}`}>
            <TerminalDisplay
                terminals={terminals}
                setTerminals={setTerminals}
                selectedTerminal={selectedTerminal}
                setSelectedTerminal={setSelectedTerminal}
                runCommand={runCommand}
                runCommandInCurrentProject={runCommandInCurrentProject}
                runCommandAndGetOutput={runCommandAndGetOutput}
                doesCurrentProjectHaveTerminal={doesCurrentProjectHaveTerminal}
                setDoesCurrentProjectHaveTerminal={setDoesCurrentProjectHaveTerminal}
                devTerminalId={devTerminalId}
                setDevTerminalId={setDevTerminalId}
                selectedProject={selectedProject}
            />            </div>
            <button onClick={toggleTerminal}>{isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}</button>
            <button onClick={fetchGitDiff}>Fetch Git Diff</button>
            </div>
        </div>
    );
}

export default CodeCentral;
