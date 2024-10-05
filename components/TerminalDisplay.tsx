import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "xterm/css/xterm.css";
import TerminalBar from "./TerminalBar";
import TerminalInstance from "./TerminalInstance";

const TerminalDisplay = ({
  terminals,
  setTerminals,
  selectedTerminal,
  setSelectedTerminal,
  runCommand,
  runCommandInCurrentProject, // Add runCommandInCurrentProject to props
  runCommandAndGetOutput,
  selectedProject,
  doesCurrentProjectHaveTerminal,
  setDoesCurrentProjectHaveTerminal,
  devTerminalId, // Receive devTerminalId
  setDevTerminalId // Receive setDevTerminalId
}: any) => {

  const [prexistingTerminals, setPrexistingTerminals] = useState<number[]>([]);

  useEffect(() => {
    listSessions();
  }, []);

  useEffect(() => {
    prexistingTerminals.forEach((id: any) => {
      reconnectTerminal(id);
    });
  }, [prexistingTerminals]);

  // This effect reacts to changes in selectedProject
  useEffect(() => {
    if (selectedProject && !doesCurrentProjectHaveTerminal) {
      console.log(`Selected project changed to: ${selectedProject}`);
      // Logic to create a new terminal session for the selected project
      createTerminalSessionForProject(selectedProject);
      setDoesCurrentProjectHaveTerminal(true);
    }
  }, [selectedProject, doesCurrentProjectHaveTerminal]);

  const listSessions = async () => {
    const alreadyRunningTerminals: any[] = [];
    const ws = new WebSocket("wss://natetrystuff.com:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'list' }));
    };
    ws.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      if (message.type === 'sessions') {
        message.data.forEach((sessionId: any) => {
          const id = parseInt(sessionId.split('-')[1]);
          alreadyRunningTerminals.push(id);
        });
      }
      setPrexistingTerminals(alreadyRunningTerminals);
      ws.close();
    }
  };

  const createTerminalSessionForProject = (project: any) => {
    console.log(`Creating terminal session for project ${project.name}`);
    const id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals((prev: any) => [...prev, { id: id_, terminalInstance: null, ws: null }]);
    setDevTerminalId(id_); // Set the devTerminalId when creating a new terminal session
    createTerminalSession(id_);

    // Run the specified command
    const runCommandWithLogging = `cd /dev-projects/${project.name}`;
    console.log(`Running command in project terminal: ${runCommandWithLogging}`); // Log before running command
    runCommandInCurrentProject(runCommandWithLogging);
  };

  const openTerminal = () => {
    const id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    console.log(`Opening terminal with ID: ${id_}`);
    setTerminals((prev: any) => [
      ...prev,
      { id: id_, terminalInstance: null, ws: null },
    ]);
    createTerminalSession(id_);
  };

  const closeTerminal = (id: number) => {
    const terminal = terminals.find((t: any) => t.id === id);
    terminal?.ws?.send(JSON.stringify({ type: 'stop', data: `session-${id}`, id: `session-${id}` }));
    terminal?.ws?.close();
    setTerminals((prev: any) => prev.filter((t: any) => t.id !== id));
    if (selectedTerminal === id) setSelectedTerminal(null);
  };

  const createTerminalSession = async (id: number) => {
    const { Terminal } = await import("xterm");
    const terminal = new Terminal();
    const terminalElement = await waitForElement(`terminal-${id}`);
    if (terminalElement) {
      terminal.open(terminalElement);
      const ws = new WebSocket("wss://natetrystuff.com:3001");
      ws.onopen = () => {
        const sessionId = `session-${id}`;
        console.log(`Creating terminal session with ID: ${id}`);
        ws.send(JSON.stringify({ type: 'create', data: sessionId }));
        terminal.onData((data: any) => {
          ws.send(JSON.stringify({ type: 'command', id: sessionId, data }));
        });
        ws.onmessage = (event: any) => {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            terminal.write(message.data.toString());
          }
        };
      }
      setSelectedTerminal(id);
      setTerminals((prev: any) =>
        prev.map((t: any) =>
          t.id === id ? { id, terminalInstance: terminal, ws } : t
        )
      );
    }
  };

  const waitForElement = async (selector: any, timeout = 5000) => {
    const pollInterval = 100;
    let elapsedTime = 0;
    while (elapsedTime < timeout) {
      const element = document.getElementById(selector);
      if (element) return element;
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      elapsedTime += pollInterval;
    }
    throw new Error(`Element with selector "${selector}" not found after ${timeout}ms.`);
  };

  const reconnectTerminal = async (id: number) => {
    setTerminals((prev: any) => [
      ...prev,
      { id: id, terminalInstance: null, ws: null },
    ]);
    setSelectedTerminal(id);
    const { Terminal } = await import("xterm");
    const terminal = new Terminal();
    const terminalElement = await waitForElement(`terminal-${id}`);
    if (terminalElement) {
      terminal.open(terminalElement);
      const ws = new WebSocket(`wss://natetrystuff.com:3001?nocache=${Date.now()}`);
      ws.onopen = () => {
        const sessionId = `session-${id}`;
        console.log(`Resuming terminal session with ID: ${id}`);
        ws.send(JSON.stringify({ type: 'resume', data: sessionId }));
        ws.send(JSON.stringify({ type: 'command', id: sessionId, data: '\r' }));
        terminal.onData((data: any) => {
          ws.send(JSON.stringify({ type: 'command', id: sessionId, data }));
        });

        ws.onmessage = (event: any) => {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            terminal.write(message.data.toString());
          }
        };
      };
      setTerminals((prev: any) =>
        prev.map((t: any) =>
          t.id === id ? { id, terminalInstance: terminal, ws } : t
        )
      );
    }
  };

  return (
    <div className="p-4">
      <TerminalBar
        terminals={terminals.map((t: any) => t.id)}
        selectedTerminal={selectedTerminal}
        setSelectedTerminal={setSelectedTerminal}
        openTerminal={openTerminal}
      />
      {terminals.map((t: any) => (
        <TerminalInstance
          key={t.id}
          id={t.id}
          isSelected={selectedTerminal === t.id}
          closeTerminal={closeTerminal}
          runCommand={runCommand}
          runCommandAndGetOutput={runCommandAndGetOutput}
        />
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
