//DESC: This file is responsible for managing a central code viewing and editing interface that includes functionalities for file handling, project selection, and interactive chat operations with automated coding responses.
import { useEffect, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import FileViewer from './FileViewer';
import FileListDropdown from './FileListDropdown';
import TerminalDisplay from './TerminalDisplay';
import { getFile, getProjectFiles, getProjects, getTopLevelArrayElements, getTopLevelValues, replaceCode } from '../app/utils';
import Chat from './Chat';
import { askChat, askChatNoStream, askGptToFindWhichFiles, askGptToFindWhichProject } from '@/services/chatService';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages, setLoading} from '@/slices/MessagesSlice';
import { Project, ProjectFile } from '@/types/project';
import { setBranchName, setCurrentProject, setCurrentProjectFileNames, setProjects } from '@/slices/ProjectSlice';
import { getGitBranch, getGitDiff } from '@/services/gitService';
import SystemDashboard from './SystemDashboard';
import ProcessDashboard from './ProcessDashboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import DevBox from './DevBox';

const CodeCentral = () => {
    const dispatch: AppDispatch = useDispatch();
    const [highlightedFiles, setHighlightedFiles] = useState<ProjectFile[]>([]);
    const [editedFiles, setEditedFiles] = useState<ProjectFile[]>([]);
    const [isApiRunning, setIsApiRunning] = useState<boolean|null>(null);
    const [isWebRunning, setIsWebRunning] = useState<boolean|null>(null); // New state for WEB

    const chatMessages = useSelector((state: RootState) => state.Messages.messages);
    const {projectDir, currentProjectFileNames, currentProject, branchName} = useSelector((state: RootState) => state.Projects);

    useEffect(() => {
        const lastMessage = chatMessages[chatMessages.length - 1];
        if (lastMessage.role === 'user') {
            dispatch(setLoading(true));
            setActiveTab('chat');
            askChat(chatMessages, highlightedFiles, (messages) => {
                dispatch(setMessages(messages));
            },
            (editedFiles) => {
                setEditedFiles(editedFiles);
            },
            (loading) => {
                dispatch(setLoading(loading));
            }
            );
        }
    }
    , [chatMessages]);

    useEffect(() => {
        handleGetApiStatus();
        handleGetWebStatus(); // New WEB status check
        const intervalId = setInterval(() => {
            handleGetApiStatus();
            handleGetWebStatus(); // Run every 5 seconds for WEB
        }, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const [featbugDescription, setFeatbugDescription] = useState<string>("");

    const [terminals, setTerminals] = useState<{ id: number; terminalInstance: Terminal | null; ws: WebSocket | null }[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);
    const [devTerminalId, setDevTerminalId] = useState<number | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>('');
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('file');

    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
    const toggleTerminal = () => setIsTerminalOpen(!isTerminalOpen); 


    const [doesCurrentProjectHaveTerminal, setDoesCurrentProjectHaveTerminal] = useState<boolean>(false);

    const [commitMessage, setCommitMessage] = useState<string>('');
    const [prTitle, setPrTitle] = useState<string>('');
    const [prBody, setPrBody] = useState<string>('');
    const [gitDiff, setGitDiff] = useState<any>(null);

    useEffect(() => {
        if (currentProject && doesCurrentProjectHaveTerminal) {
            const runCommandWithLogging = `cd /dev-projects/${currentProject.name}`;
            runCommandInCurrentProject(runCommandWithLogging);
        }
    }, [currentProject, doesCurrentProjectHaveTerminal, terminals]);

    useEffect(() => {
        if (currentProject) {
            getGitBranch(currentProject.name, projectDir).then((branchName) => {
                dispatch(
                setBranchName(branchName)
                );
            }).catch((error) => {
                console.error('Error:', error);
            }   
            );
        }
    }, [currentProject]);

    useEffect(() => {
        if (projectDir.length > 1) {
            getProjects(projectDir).then((data) => {
                dispatch(setProjects(data));
            }).catch((error) => {
                console.error('Error fetching projects:', error);
            });
        }
    }, [projectDir]);

    useEffect(() => {
        if (currentProject) {
            (async () => {
                const data = await getProjectFiles(currentProject);
                dispatch(setCurrentProjectFileNames(data));
            })();
        }
    }, [currentProject]);
    
    const runCommand = (command: any) => {
        const terminal = terminals.find((t) => t.id === selectedTerminal);
        if (terminal && terminal.ws && terminal.ws.readyState === WebSocket.OPEN) {
          terminal.ws.send(JSON.stringify({ type: 'command', id: `session-${selectedTerminal}`, data: command + '\r' }));
        } else {
          console.error('No active terminal selected or WebSocket not connected.');
        }
      };
    
    const runCommandInCurrentProject = (command: any) => {
        const terminal = terminals.find((t) => t.id === devTerminalId);
        if (terminal && terminal.ws) {
            let attempts = 0;
            const maxAttempts = 5;
            setTimeout(() => {
                const interval = setInterval(() => {
                    if (terminal.ws?.readyState === WebSocket.OPEN) {
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
    
    


    useEffect(() => {
        if (gitDiff && gitDiff.data.diff !== '') {
            const message = `Please provide a JSON response with the 'answer' field containing the commit message based on these changes: ${gitDiff.data.diff}`;
            askChatNoStream([{ role: 'user', content: message }])
                .then(data => {setCommitMessage(data.answer) });
        }
    }, [gitDiff]);

    useEffect(() => {
        if (gitDiff && gitDiff.data.diff !== '') {
            const message = `Please provide a JSON response with the 'answer' fields containing the PR title and body based on these changes: ${gitDiff.data.diff}`;
            askChatNoStream([{ role: 'user', content: message }])
                .then(data => {
                    setPrTitle(data.answer.title);
                    setPrBody(data.answer.body);
                });
        }
    }, [gitDiff]);

    const handleReplaceCode = async () => {
        if (!currentProject) {
            console.error('No project selected.');
            return;
        }
        await replaceCode(currentProject.name, editedFiles);
        setGitDiff(await getGitDiff(currentProject.name));
    };

    const updateChatCode = (code: string) => {
        setEditedFiles(prevChatCodes => {
            const updatedChatCodes = prevChatCodes.map(fileData =>
                fileData.name === selectedFileName ? { ...fileData, content:code } : fileData
            );
            return updatedChatCodes;
        });
    };

    const handleNewHighlitghtedFiles = (filenames: string[]) => {
        if (!currentProject) {
            console.error('No project selected.');
            return;
        }
        const newHighlightedFileNames = filenames.filter(filename => currentProjectFileNames.includes(filename));
        Promise.all(newHighlightedFileNames.map(async (filename) => {
            return { name: filename, content: await getFile(filename, currentProject.name) };
        })).then(newHighlightedFiles => {
            setHighlightedFiles(newHighlightedFiles);
        }).catch(error => {
            console.error('Error fetching file contents:', error);
        });
    }

    const handleNewSelectedFile = (filename: string) => {
        setSelectedFileName(filename);
    }

    const handleHighlight = async (fileName: any, event: { shiftKey: any; }) => {
        if (!currentProject) {
            console.error('No project selected.');
            return;
        }
        const isHighlighted = highlightedFiles.some((highlightedStuff) => highlightedStuff.name === fileName);
        const fileContent = await getFile(fileName, currentProject.name);

        if (event.shiftKey) {
            setHighlightedFiles(isHighlighted 
                ? highlightedFiles.filter((highlightedStuff) => highlightedStuff.name !== fileName)
                : [...highlightedFiles, { name: fileName, content: fileContent }]);
            setSelectedFileName(fileName);
        } else {
            setSelectedFileName(fileName);
            setSelectedFileContent(fileContent);

            if (!isHighlighted) {
                setHighlightedFiles([...highlightedFiles, { name: fileName, content: fileContent }]);
            }
        }
    }

    const[isSystemOpen, setIsSystemOpen] = useState(false); 
    const[isProcessOpen, setIsProcessOpen] = useState(false);
    const editedCodeToDisplay = editedFiles.find((fileData) => fileData.name === selectedFileName)?.content ?? null
    const [currentProcessState, setCurrentProcessState] = useState<string>('None');
    const handleStartProcess = async () => {
        setCurrentProcessState('find-projects');           
    }

    useEffect(() => {
        if (currentProcessState === 'find-projects') {
            if(currentProject){
                setCurrentProcessState('find-files');

            }
            else if (featbugDescription) {
                getProjects(projectDir).then((projects) => {
                    const projectsString = projects.map((project:Project) => project.name).join(', ');
                    askGptToFindWhichProject(projectsString, featbugDescription).then((answer) => {
                        const selectedProject = projects.find((project:Project) => project.name === answer[0]);
                        if (selectedProject) {
                            dispatch(setCurrentProject(selectedProject));
                            setCurrentProcessState('find-files');
                        }
                    })
                }
            );
        }
        }
        if (currentProcessState === 'find-files') {
            if (featbugDescription && currentProject && currentProjectFileNames.length > 0) {
                askGptToFindWhichFiles(featbugDescription).then((fileName) => {

                if (currentProjectFileNames.includes(fileName)) {
                    setCurrentProcessState('None');
                    handleNewHighlitghtedFiles([fileName]);
                    handleNewSelectedFile(fileName);
                }
                }
            );
        }
    }
    }, [currentProcessState, currentProjectFileNames]);

    // Add state and handler for GET requests
    const [routeResponses, setRouteResponses] = useState<{ [key: string]: string }>({});
    const handleGetApiStatus = async () => {
        try {
            const response = await fetch('/api/check-api-status');
            const data = await response.json();
            console.log('API Status:', data.data.isRunning);
            setIsApiRunning(data.data.isRunning);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleGetWebStatus = async () => {  // New function for WEB status
        try {
            const response = await fetch('/web/check-web-status');
            const data = await response.json();
            console.log('WEB Status:', data.data.isRunning);
            setIsWebRunning(data.data.isRunning);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleGetRequest = async (routeUrl: string) => {
        try {
            const response = await fetch(routeUrl);
            const data = await response.json();
            setRouteResponses(prevState => ({
                ...prevState,
                [routeUrl]: JSON.stringify(data, null, 2)
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-col">
            <div id='dev-environment' className="absolute top-0 left-0 m-5">
                <DevBox
                    name={'API'}
                    isRunning={isApiRunning}
                    start={() => handleGetRequest('/api/start-api')}
                    stop={() => handleGetRequest('/api/stop-api')}
                />
                <DevBox
                    name={'WEB'}
                    isRunning={isWebRunning} // New WEB status check
                    start={() => handleGetRequest('/web/start-web')}
                    stop={() => handleGetRequest('/web/stop-web')}
                />
            </div>
            <div className="flex justify-between m-2">
                <button onClick={toggleTerminal} className="bg-green-500 text-white p-2 m-2">
                    {isTerminalOpen ? 'Close Terminal' : 'Open Terminal'}
                </button>
                <button
                    onClick={() => setIsSystemOpen(!isSystemOpen)}
                    className="bg-blue-500 text-white p-2 m-2"
                >System Dashboard ?</button>

                <div className="flex items-center flex flex-1">
                    <span className='m-2 p-2'>
                        {
                            currentProcessState
                        }
                    </span>
                    <input 
                        type="text" 
                        placeholder="Enter description" 
                        className="p-2 border border-gray-300 rounded flex-1 text-black"
                        value={featbugDescription}
                        onChange={(e) => setFeatbugDescription(e.target.value)}
                    />
                    <button 
                        onClick={() => {
                            if (featbugDescription.trim() !== "") {
                                handleStartProcess();
                            } else {
                                alert("Please enter a description");
                            }
                        }} 
                        className="bg-green-500 text-white p-2 mx-2 rounded"
                    >
                        Start
                    </button>
                    <button onClick={() => handleGetRequest('/api/compile-api')} className="bg-teal-500 text-white p-2 m-2">Compile API</button>
                </div>
                <button
                    onClick={() => setIsProcessOpen(!isProcessOpen)}
                    className="bg-purple-500 text-white p-2 m-2"
                >Process Dashboard ?</button>
            </div>
            <div>
                {branchName && <p>Current Branch: {branchName}</p>}
            </div>

            <div className="flex justify-around bg-gray-100 p-2">
            </div>
            <div className="flex flex-grow flex-col overflow-auto">
                <div className="flex flex-row w-full h-full">
                    <FileListDropdown
                        handleFlightClick={handleHighlight}
                        selectedFileName={selectedFileName}
                        highlightedFiles={highlightedFiles}
                        chatCodes={editedFiles}
                        setSelectedFileName={setSelectedFileName}
                    />
                    {
                        isSystemOpen && currentProject ? 
                        <SystemDashboard project={currentProject} /> :
                        isProcessOpen ? // Add condition for ProcessDashboard
                        <ProcessDashboard /> :
                        <FileViewer
                            setSelectedChatCode={updateChatCode}
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab} 
                            selectedFileContent={selectedFileContent} 
                            selectedChatCode={editedCodeToDisplay}
                            selectedFileName={selectedFileName} 
                            replaceCode={handleReplaceCode} 
                        />
                    }
                    
                    <Chat 
                        conversation={chatMessages} 
                        runCommand={runCommandInCurrentProject}  
                        commitMessage={commitMessage} 
                        prTitle={prTitle} 
                        prBody={prBody} 
                        selectedProject={currentProject} 
                        setFeatbugDescription={setFeatbugDescription}
                    />
                    {
                    isTerminalOpen &&
                        <TerminalDisplay terminals={terminals}
                            setTerminals={setTerminals}
                            selectedTerminal={selectedTerminal}
                            setSelectedTerminal={setSelectedTerminal}
                            runCommand={runCommand}
                            runCommandInCurrentProject={runCommandInCurrentProject}
                            doesCurrentProjectHaveTerminal={doesCurrentProjectHaveTerminal}
                            setDoesCurrentProjectHaveTerminal={setDoesCurrentProjectHaveTerminal}
                            devTerminalId={devTerminalId}
                            setDevTerminalId={setDevTerminalId}
                            selectedProject={currentProject}
                        /> }          

                </div>
            </div>

        </div>
    );
}

export default CodeCentral;
