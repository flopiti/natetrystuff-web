// components/TerminalComponent.tsx
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const TerminalComponent = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTerminal = async () => {
      const { Terminal } = await import('xterm');
      const terminal = new Terminal();
      terminal.open(terminalRef.current!);

      const ws = new WebSocket('ws://147.182.234.182:3001');
      ws.onopen = () => {
        terminal.onData(data => {
          ws.send(data);
        });

        ws.onmessage = (event) => {
          terminal.write(event.data.toString());
        };
      };

      return () => {
        ws.close();
      };
    };

    loadTerminal();
  }, []);

  return <div ref={terminalRef} style={{ height: '100vh', width: '100%' }} />;
};

export default dynamic(() => Promise.resolve(TerminalComponent), { ssr: false });
