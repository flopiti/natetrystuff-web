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

  useEffect(() => {
    if (terminals.length === 0) {
      openTerminal();
    }
  });

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

  const runCommand = (command: any) => {
    const terminal = terminals.find((t) => t.id === selectedTerminal);
    terminal?.ws?.send(command + "\n");
  };

  const openTerminal = () => {
    const newId =
      (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals((prev) => [
      ...prev,
      { id: newId, terminalInstance: null, ws: null },
    ]);
    loadTerminal(newId);
    setSelectedTerminal(newId);
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
