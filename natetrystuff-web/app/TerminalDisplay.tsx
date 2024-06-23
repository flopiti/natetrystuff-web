// components/TerminalDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';

const TerminalDisplay = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [terminalData, setTerminalData] = useState('');

  useEffect(() => {
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

      return () => {
        ws.close();
      };
    };

    loadTerminal();
  }, []);

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
      <div ref={terminalRef} className="h-40vh w-full" />
      <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => sendCommandsToTerminal(['cd /dev-projects/natetrystuff-web/natetrystuff-web', 'npm run dev'])}>Send Command</button>
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
