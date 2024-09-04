import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "xterm/css/xterm.css";
import TerminalBar from "./TerminalBar";
import TerminalInstance from "./TerminalInstance";

const TerminalDisplay = () => {
  const [terminals, setTerminals] = useState<{ id: number; terminalInstance: any; ws: WebSocket | null }[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);
  const [prexistingTerminals, setPrexistingTerminals] = useState<number[]>([]);

  useEffect(() => {
    listSessions();
  },[]);

  useEffect(() => {    
    prexistingTerminals.forEach((id) => {
      reconnectTerminal(id);
    });
  }, [prexistingTerminals]);
  
  const listSessions = async () => {
    const alreadyRunningTerminals:any[] = [];
    const ws = new WebSocket("wss://natetrystuff.com:3001");
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'list' }));
    };
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'sessions') {
        message.data.forEach((sessionId:any) => {
          const id = parseInt(sessionId.split('-')[1]);
          alreadyRunningTerminals.push(id);        });
      }
      setPrexistingTerminals(alreadyRunningTerminals);
      ws.close();
    }
  };

  const runCommand = (command: any) => {
    const terminal = terminals.find((t) => t.id === selectedTerminal);
    terminal?.ws?.send(command + "\n");
  };

  const openTerminal = () => {   
    const id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals((prev) => [
      ...prev,
      { id: id_, terminalInstance: null, ws: null },
    ]);
    createTerminalSession(id_);
  };

  const closeTerminal = (id: number) => {
    const terminal = terminals.find((t) => t.id === id);
    terminal?.ws?.send(JSON.stringify({ type: 'stop', data: `session-${id}`, id: `session-${id}` }));
    terminal?.ws?.close();
    setTerminals((prev) => prev.filter((t) => t.id !== id));
    if (selectedTerminal === id) setSelectedTerminal(null);
  };

  const createTerminalSession = async (id: number) => {
    const { Terminal } = await import("xterm");
    const terminal = new Terminal();
    const terminalElement = document.getElementById(`terminal-${id}`);
    if (terminalElement) {
      terminal.open(terminalElement);
      const ws = new WebSocket("wss://natetrystuff.com:3001");
      ws.onopen = () => {
        const sessionId = `session-${id}`;
        ws.send(JSON.stringify({ type: 'create', data: sessionId }));
        terminal.onData((data) => {
          ws.send(JSON.stringify({ type: 'command', id: sessionId, data }));
        });
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            terminal.write(message.data.toString());
          }
        };
      };
      setSelectedTerminal(id);
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === id ? { id, terminalInstance: terminal, ws } : t
        )
      );
    }
  };
  const waitForElement = async (selector:any, timeout = 5000) => {
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
  
  const reconnectTerminal = async (id:number) => {
    setTerminals((prev) => [
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
        ws.send(JSON.stringify({ type: 'resume', data: sessionId }));
        ws.send(JSON.stringify({ type: 'command', id: sessionId , data: '\r'}));
        terminal.onData((data) => {
          ws.send(JSON.stringify({ type: 'command', id: sessionId, data }));
        });
  
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'output') {
            terminal.write(message.data.toString());
          }
        };
      };
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === id ? { id, terminalInstance: terminal, ws } : t
        )
      );
    }
  };
  

  return (
    <div className="p-4">
      <TerminalBar
        terminals={terminals.map((t) => t.id)}
        selectedTerminal={selectedTerminal}
        setSelectedTerminal={setSelectedTerminal}
        openTerminal={openTerminal}
      />
      {terminals.map((t) => (
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
