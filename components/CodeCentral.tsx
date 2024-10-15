//DESC: This file is responsible for managing a central code viewing and editing interface that includes functionalities for file handling, project selection, and interactive chat operations with automated coding responses.
import { useEffect, useState } from 'react';
import { Terminal } from 'xterm';
import FileViewer from './FileViewer';
import FileListDropdown from './FileListDropdown';
import TerminalDisplay from './TerminalDisplay';
import { fetchHighlightedFilesContent, getFile, getProjectFiles, getProjects, getTopLevelArrayElements, getTopLevelValues, handleFlightClick, replaceCode } from '../app/utils';
import Chat from './Chat';
import { askChatNoStream } from '@/services/chatService';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, setLoading} from '@/slices/MessagesSlice';

const CodeCentral = () => {
    const dispatch: AppDispatch = useDispatch();
    
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [chatCodes, setChatCodes] = useState<any[]>([]);
    const conversation = useSelector((state: RootState) => state.Messages.messages);
    const loading = useSelector((state: RootState) => state.Messages.loading);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            setSelectedChatCode('');
            dispatch(setLoading(true));
            askChat(conversation, highlightedFiles, highlightedFilesContent);
        }
    }, [conversation, highlightedFiles, highlightedFilesContent]);


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

    const [selectedChatCode, setSelectedChatCode] = useState<string>('');
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen); 
    const [branch, setBranch] = useState<string | null>(null);

    const [doesCurrentProjectHaveTerminal, setDoesCurrentProjectHaveTerminal] = useState<boolean>(false);

    const [commitMessage, setCommitMessage] = useState<string>('');
    const [prTitle, setPrTitle] = useState<string>('');
    const [prBody, setPrBody] = useState<string>('');
    const [gitDiff, setGitDiff] = useState<any>(null);

    const getBranch = async () => {
        const response = await fetch(`api/current-branch?dirPath=${dirPath}/${selectedProject.name}`);
        const { data } = await response.json();
        console.log('received branch though : ' , data.branchName);
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

        console.log('Starting chat stream');
        console.log(chatCodes)
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
                                dispatch(setMessages([...conversation, { content: value, role: 'assistant', type: 'text' }]));
                            }
                            if(index + 1 === 2){
                                const files = getTopLevelArrayElements(value);
                                let arrayElementsValues = files.map((element) => {
                                    return getTopLevelValues(element);
                                });
                                const newChatCodes = arrayElementsValues.map((element) => ({
                                    fileName: element[0],
                                    code: element[1] ? element[1] : ''
                                }));
                                setChatCodes(newChatCodes);
                            }
                        });
                    }
                }
            } catch (error) {
                console.error('Error processing JSON chunk:', error);
            }
        }
        dispatch(setLoading(false));
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
                const contentPromises = highlightedFiles.map(async (fileName) => {
                    const chatCode = chatCodes.find(chatCode => chatCode.fileName === fileName);
                    if (chatCode) {
                        return chatCode.code;  // Use chat code if available
                    } else {
                        const fileContent = await fetchHighlightedFilesContent([fileName], selectedProject.name);
                        return fileContent[0];
                    }
                });
                const content = await Promise.all(contentPromises);
                setHighlightedFilesContent(content);
            })();
        }
    }, [highlightedFiles, selectedProject, chatCodes]);

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
                .then(data => {setCommitMessage(data.answer) });
        }
    }, [gitDiff]);

    useEffect(() => {
        if (gitDiff && gitDiff.data.diff !== '') {
            console.log('Git Diff:', gitDiff);
            const message = `Please provide a JSON response with the 'answer' fields containing the PR title and body based on these changes: ${gitDiff.data.diff}`;
            askChatNoStream([{ role: 'user', content: message }])
                .then(data => {
                    setPrTitle(data.answer.title);
                    setPrBody(data.answer.body);
                });
        }
    }, [gitDiff]);

    const handleReplaceCode = async () => {
        await replaceCode(selectedProject.name, chatCodes);
        fetchGitDiff(); // Fetch git diff after replacing code
    };

    const updateChatCode = (code: string) => {
        setChatCodes(prevChatCodes => {
            const updatedChatCodes = prevChatCodes.map(fileData =>
                fileData.fileName === selectedFileName ? { ...fileData, code } : fileData
            );
            return updatedChatCodes;
        });
    };

    const fetchDescComments = async () => {
        if (selectedProject) {
            try {
                const response = await fetch(`/api/get-desc-comments?project=${selectedProject.name}`);
                const result = await response.json();
                console.log('DESC Comments:', result.data);
            } catch (error) {
                console.error('Error fetching DESC comments:', error);
            }
        } else {
            console.error('No project selected.');
        }
    };

    const handleNewHighlitghtedFiles = (filenames: string[]) => {
        const newHighlightedFiles = filenames.filter(filename => projectFiles.includes(filename));
        setHighlightedFiles(newHighlightedFiles);
    }

    const handleNewSelectedFile = (filename: string) => {
        setSelectedFileName(filename);
        setSelectedChatCode('');
    }

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-col">
            <div>
                {branch && <p>Current Branch: {branch}</p>}
            </div>
            <div className="flex flex-grow flex-col overflow-auto">
                <div className="flex flex-row w-full h-full">
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
                        setSelectedChatCode={updateChatCode}  // Changed this prop
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab} 
                        selectedFileContent={selectedFileContent} 
                        selectedChatCode={selectedChatCode} 
                        selectedFileName={selectedFileName} 
                        replaceCode={handleReplaceCode} 
                        loading={loading}
                    />
                    <Chat 
                        handleNewSelectedFile={handleNewSelectedFile}
                        handleNewHighlitghtedFiles={handleNewHighlitghtedFiles}
                        conversation={conversation} 
                        runCommand={runCommandInCurrentProject}  
                        getBranch={getBranch} 
                        branch={branch} 
                        commitMessage={commitMessage} 
                        prTitle={prTitle} 
                        prBody={prBody} 
                        selectedProject={selectedProject} 
                    />
                    <div id='terminal-window' className={`${isTerminalOpen ? '' :'hidden'}`}>
                    <TerminalDisplay
                        terminals={terminals}
                        setTerminals={setTerminals}
                        selectedTerminal={selectedTerminal}
                        setSelectedTerminal={setSelectedTerminal}
                        runCommand={runCommand}
                        runCommandInCurrentProject={runCommandInCurrentProject}
                        doesCurrentProjectHaveTerminal={doesCurrentProjectHaveTerminal}
                        setDoesCurrentProjectHaveTerminal={setDoesCurrentProjectHaveTerminal}
                        devTerminalId={devTerminalId}
                        setDevTerminalId={setDevTerminalId}
                        selectedProject={selectedProject}
                    />            </div>
                    <button onClick={toggleTerminal}>{isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}</button>
                </div>
            </div>
            <button onClick={fetchDescComments}>Fetch DESC Comments</button>
        </div>
    );
}

export default CodeCentral;
