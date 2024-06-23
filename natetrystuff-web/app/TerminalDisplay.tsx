// components/TerminalDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';
import TerminalBar from './TerminalBar'; // Import the TerminalBar component

const TerminalDisplay = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [terminalData, setTerminalData] = useState('');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [terminals, setTerminals] = useState<number[]>([]);

  const loadTerminal = async () => {
    const { Terminal } = await import('xterm');
    const terminal = new Terminal();
    terminal.open(terminalRef.current!);
    terminalInstanceRef.current = terminal;

    const ws = new WebSocket('wss://natetrystuff.com:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      terminal.onData(data => {
        setTerminalData(prevData => prevData + data);
        ws.send(data);
      });

      ws.onmessage = (event) => {
        terminal.write(event.data.toString());
      };
      ws.send('su developer\n');
    };
  };

  useEffect(() => {
    if (isTerminalVisible) {
      loadTerminal();
      setTerminals((prev) => [...prev, terminals.length + 1]);
    } else {
      setTerminals((prev) => prev.slice(0, -1));
    }
    return () => {
      wsRef.current?.close();
      terminalInstanceRef.current?.dispose();
    };
  }, [isTerminalVisible]);

  useEffect(() => {
    if (terminalData) {
      console.log('Terminal data changed:', terminalData);
    }
  }, [terminalData]);

  const sendCommandsToTerminal = (commands: string[]) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      commands.forEach((command, index) => {
        setTimeout(() => {
          wsRef.current?.send(command + '\n');
        }, index * 100);
      });
    }
  };

  return (
    <div className="p-4">
      <button className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsTerminalVisible(true)}>Open Terminal</button>
      <TerminalBar terminals={terminals} />
      {isTerminalVisible && (
        <div>
          <div ref={terminalRef} className="h-40vh w-full mb-4" />
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => sendCommandsToTerminal(['cd /dev-projects/natetrystuff-web/natetrystuff-web', 'npm run dev'])}>Send Command</button>
          <button className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsTerminalVisible(false)}>Close Terminal</button>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
