import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';
import TerminalBar from './TerminalBar';

const TerminalDisplay = () => {
  const [terminals, setTerminals] = useState<{ id: number, terminalInstance: any, ws: WebSocket | null }[]>([]);
  const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);

  useEffect(() => {
    if (terminals.length === 0) {
      openTerminal();
    }
  }, []);

  const loadTerminal = async (id: number) => {
    const { Terminal } = await import('xterm');
    const terminal = new Terminal();
    const terminalElement = document.getElementById(`terminal-${id}`);
    if (terminalElement) { 
        terminal.open(terminalElement);
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
    }
  };

  const runCommand = (command: any) => {
    const terminal = terminals.find(t => t.id === selectedTerminal);
    terminal?.ws?.send(command + '\n');
  };

  const openTerminal = () => {
    const newId = (terminals.length > 0 ? terminals[terminals.length - 1].id : 0) + 1;
    setTerminals(prev => [...prev, { id: newId, terminalInstance: null, ws: null }]);
    loadTerminal(newId);
    setSelectedTerminal(newId);
  };

  const closeTerminal = (id: number) => {
    setTerminals(prev => prev.filter(t => t.id !== id));
    if(selectedTerminal === id) setSelectedTerminal(null);
  };

  return (
    <div className="p-4">
      <TerminalBar terminals={terminals.map(t => t.id)} selectedTerminal={selectedTerminal} setSelectedTerminal={setSelectedTerminal} openTerminal={openTerminal} />
      {terminals.map(t => (
        <div key={t.id} className={`${selectedTerminal === t.id ? '' : 'hidden'}`}>
          <div id={`terminal-${t.id}`} className="h-40vh w-full mb-4" />
          <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeTerminal(t.id)}>Close Terminal {t.id}</button>
          <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => runCommand('cd /dev-projects/natetrystuff-web/natetrystuff-web && exec npm run dev')}>Run dev environment</button>
          <button className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={() => runCommand('cd /dev-projects/natetrystuff-api/natetrystuff && exec mvn spring-boot:run -Dspring-boot.run.profiles=local')}>Run API in dev</button>
        </div>
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });