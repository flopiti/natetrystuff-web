import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "xterm/css/xterm.css";
import TerminalBar from "./TerminalBar";
import TerminalInstance from "./TerminalInstance";

const TerminalDisplay = () => {
  const [terminals, setTerminals] = useState<
    { id: number; terminalInstance: any; ws: WebSocket | null }[]
  >([]);
  const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);
  const [prexistingTerminals, setPrexistingTerminals] = useState<number[]>([]);

  useEffect(() => {
    listSessions();
  },[]);

  useEffect(() => {    
    prexistingTerminals.forEach((id) => {
      openTerminal(id);
    });
  }, [prexistingTerminals]);

  const loadTerminal = async (id: number) => {
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
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === id ? { id, terminalInstance: terminal, ws } : t
        )
      );
    }
  };
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

  const openTerminal = (id_: number | null) => {
    if(id_ === null){
      id_ = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    }
    setTerminals((prev) => [
      ...prev,
      { id: id_, terminalInstance: null, ws: null },
    ]);
    loadTerminal(id_);
    setSelectedTerminal(id_);
  };

  const closeTerminal = (id: number) => {
    setTerminals((prev) => prev.filter((t) => t.id !== id));
    if (selectedTerminal === id) setSelectedTerminal(null);
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
