// components/TerminalDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';
import TerminalBar from './TerminalBar'; // Import the TerminalBar component

const TerminalDisplay = () => {
  const terminalRefs = useRef<HTMLDivElement[]>([]);
  const terminalInstanceRefs = useRef<any[]>([]);
  const wsRefs = useRef<(WebSocket | null)[]>([]);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);
  const [terminals, setTerminals] = useState<number[]>([]);

  const loadTerminal = async (index: number) => {
    const { Terminal } = await import('xterm');
    const terminal = new Terminal();
    terminal.open(terminalRefs.current[index]);
    terminalInstanceRefs.current[index] = terminal;

    const ws = new WebSocket('wss://natetrystuff.com:3001');
    wsRefs.current[index] = ws;

    ws.onopen = () => {
      terminal.onData(data => {
        ws.send(data);
      });

      ws.onmessage = (event) => {
        terminal.write(event.data.toString());
      };
      ws.send('su developer\n');
    };
  };

  const handleOpenTerminal = () => {
    setIsTerminalVisible(true);
    setTerminals((prev) => {
      const newIndex = prev.length + 1;
      return [...prev, newIndex];
    });
  };

  const closeTerminal = (index: number) => {
    terminalInstanceRefs.current[index].dispose();
    wsRefs.current[index]?.close();
    setTerminals((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    terminals.forEach((_, index) => {
      if (!terminalInstanceRefs.current[index]) {
        loadTerminal(index);
      }
    });

    return () => {
      terminalInstanceRefs.current.forEach((terminal, index) => {
        terminal?.dispose();
        wsRefs.current[index]?.close();
      });
    };
  }, [terminals]);

  const sendCommandsToTerminal = (index: number, commands: string[]) => {
    const ws = wsRefs.current[index];
    if (ws && ws.readyState === WebSocket.OPEN) {
      commands.forEach((command, i) => {
        setTimeout(() => {
          ws.send(command + '\n');
        }, i * 100);
      });
    }
  };

  return (
    <div className="p-4">
      <button className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleOpenTerminal}>Open Terminal</button>
      <TerminalBar terminals={terminals} closeTerminal={closeTerminal} />
      {terminals.map((terminalIndex, idx) => (
        <div key={idx} className="mb-4">
          <div ref={(el) => terminalRefs.current[idx] = el!} className="h-40vh w-full mb-4" />
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => sendCommandsToTerminal(idx, ['cd /dev-projects/natetrystuff-web/natetrystuff-web', 'npm run dev'])}>Send Command to Terminal {terminalIndex}</button>
        </div>
      ))}
    </div>
  );
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
