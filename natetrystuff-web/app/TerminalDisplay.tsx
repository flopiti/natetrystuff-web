// components/TerminalDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';
import TerminalBar from './TerminalBar'; // Import the TerminalBar component

const TerminalDisplay = () => {
  const [terminals, setTerminals] = useState<{ id: number, terminalInstance: any, ws: WebSocket | null }[]>([]);

  const loadTerminal = async (id: number) => {
    const { Terminal } = await import('xterm');
    const terminal = new Terminal();
    const terminalElement = document.getElementById(`terminal-${id}`);
    terminal.open(terminalElement!);

    const ws = new WebSocket('wss://natetrystuff.com:3001');

    ws.onopen = () => {
      terminal.onData(data => {
        ws.send(data);
      });

      ws.onmessage = (event) => {
        terminal.write(event.data.toString());
      };
      ws.send('su developer\n');
    };

    setTerminals(prev => prev.map(t => t.id === id ? { id, terminalInstance: terminal, ws } : t));
  };

  const openTerminal = () => {
    const newId = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals(prev => [...prev, { id: newId, terminalInstance: null, ws: null }]);
    loadTerminal(newId);
  };

  const closeTerminal = (id: number) => {
    setTerminals(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-4">
      <TerminalBar terminals={terminals.map(t => t.id)} openTerminal={openTerminal} />
      {terminals.map(t => (
        <div key={t.id}>
          <div id={`terminal-${t.id}`} className="h-40vh w-full mb-4" />
          <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeTerminal(t.id)}>Close Terminal {t.id}</button>
        </div>
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
