//DESC: This component manages the display and lifecycle of multiple terminal instances, handling creation, reconnection, and closure of terminal sessions.
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
  runCommandInCurrentProject,
  selectedProject,
  doesCurrentProjectHaveTerminal,
  setDoesCurrentProjectHaveTerminal,
  devTerminalId,
  setDevTerminalId,
}: any) => {
  const [prexistingTerminals, setPrexistingTerminals] = useState<any[]>([]);

  useEffect(() => {
    listSessions();
  }, []);

  useEffect(() => {
    prexistingTerminals.forEach((terminalInfo: any) => {
      reconnectTerminal(terminalInfo.id, terminalInfo.name);
    });
  }, [prexistingTerminals]);

  useEffect(() => {
    if (selectedProject && !doesCurrentProjectHaveTerminal) {
      const existingTerminal = prexistingTerminals.find(t => t.name === selectedProject.name);
      if (existingTerminal) {
        console.log(`Terminal for selected project ${selectedProject.name} already exists.`);
        setDevTerminalId(existingTerminal.id);
        setDoesCurrentProjectHaveTerminal(true);
      } else {
        console.log(`Creating terminal session for project ${selectedProject.name}`);
        createTerminalSessionForProject(selectedProject);
        setDoesCurrentProjectHaveTerminal(true);
      }
    }
  }, [selectedProject, doesCurrentProjectHaveTerminal]);

  const listSessions = async () => {
    const alreadyRunningTerminals: any[] = [];
    const ws = new WebSocket("wss://natetrystuff.com:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "list" }));
    };
    ws.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      if (message.type === "sessions") {
        message.data.forEach((session: any) => {
          const sessionId = session.sessionId;
          const name = session.name;
          if (sessionId) {
            const idMatch = sessionId.match(/session-(\d+)/);
            const id = idMatch ? parseInt(idMatch[1], 10) : null;
            if (id !== null) {
              alreadyRunningTerminals.push({ id, name });
            }
          }
        });
      }
      setPrexistingTerminals(alreadyRunningTerminals);
      ws.close();
    };
  };

  const createTerminalSessionForProject = (project: any) => {
    console.log(`Creating terminal session for project ${project.name}`);
    const id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals((prev: any) => [
      ...prev,
      { id: id_, terminalInstance: null, ws: null, name: project.name },
    ]);
    setDevTerminalId(id_);
    createTerminalSession(id_, project.name);
  };

  const openTerminal = () => {
    const id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    console.log(`Opening terminal with ID: ${id_}`);
    const defaultName = `Terminal ${id_}`;
    setTerminals((prev: any) => [
      ...prev,
      { id: id_, terminalInstance: null, ws: null, name: defaultName },
    ]);
    createTerminalSession(id_, defaultName);
  };

  const closeTerminal = (id: number) => {
    const terminal = terminals.find((t: any) => t.id === id);
    terminal?.ws?.send(
      JSON.stringify({ type: "stop", data: `session-${id}`, id: `session-${id}` })
    );
    terminal?.ws?.close();
    setTerminals((prev: any) => prev.filter((t: any) => t.id !== id));
    if (selectedTerminal === id) setSelectedTerminal(null);
  };

  const createTerminalSession = async (id: number, name: string) => {
    const { Terminal } = await import("xterm");
    const terminal = new Terminal();
    const terminalElement = await waitForElement(`terminal-${id}`);
    if (terminalElement) {
      terminal.open(terminalElement);

      const ws = new WebSocket("wss://natetrystuff.com:3001");
      ws.onopen = () => {
        const sessionId = `session-${id}`;
        console.log(`Creating terminal session with ID: ${id}`);
        ws.send(
          JSON.stringify({
            type: "create",
            data: { sessionId, name },
          })
        );
        terminal.onData((data: any) => {
          ws.send(JSON.stringify({ type: "command", id: sessionId, data }));
        });
        ws.onmessage = (event: any) => {
          const message = JSON.parse(event.data);
          if (message.type === "output") {
            terminal.write(message.data.toString());
          }
        };
      };
      setSelectedTerminal(id);
      setTerminals((prev: any) =>
        prev.map((t: any) =>
          t.id === id ? { ...t, terminalInstance: terminal, ws } : t
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
    throw new Error(
      `Element with selector "${selector}" not found after ${timeout}ms.`
    );
  };

  const reconnectTerminal = async (id: number, name: string) => {
    setTerminals((prev: any) => [
      ...prev,
      { id: id, terminalInstance: null, ws: null, name },
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
        ws.send(JSON.stringify({ type: "resume", data: sessionId }));
        ws.send(JSON.stringify({ type: "command", id: sessionId, data: "\r" }));
        terminal.onData((data: any) => {
          ws.send(JSON.stringify({ type: "command", id: sessionId, data }));
        });

        ws.onmessage = (event: any) => {
          const message = JSON.parse(event.data);
          if (message.type === "output") {
            terminal.write(message.data.toString());
          }
        };
      };
      setTerminals((prev: any) =>
        prev.map((t: any) =>
          t.id === id ? { ...t, terminalInstance: terminal, ws } : t
        )
      );
    }
  };

  return (
    <div className="p-4">
      <TerminalBar
        terminals={terminals}
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
        />
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
