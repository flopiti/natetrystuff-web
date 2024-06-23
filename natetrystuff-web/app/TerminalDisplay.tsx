// components/TerminalDisplay.tsx
import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'xterm/css/xterm.css';

const TerminalDisplay = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminalData, setTerminalData] = useState('');

  useEffect(() => {
    const loadTerminal = async () => {
      const { Terminal } = await import('xterm');
      const terminal = new Terminal();
      terminal.open(terminalRef.current!);

      const ws = new WebSocket('wss://natetrystuff.com:3001');
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

  return <div ref={terminalRef} style={{ height: '40vh', width: '100%' }} />;
};

export default dynamic(() => Promise.resolve(TerminalDisplay), { ssr: false });
