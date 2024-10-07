export const runCommandInCurrentProject = (command: any, terminal:any,) => {
    if (terminal && terminal.ws) {
        let attempts = 0;
        const maxAttempts = 5;
        setTimeout(() => {
            const interval = setInterval(() => {
                if (terminal.ws?.readyState === WebSocket.OPEN) {
                    terminal.ws.send(JSON.stringify({ type: 'command', id: `session-${terminal.id}`, data: command + '\r' }));
                    clearInterval(interval);
                } else if (terminal.ws?.readyState !== WebSocket.CONNECTING || attempts >= maxAttempts) {
                    console.error('No active terminal for current project or WebSocket not connected.');
                    clearInterval(interval);
                }
                attempts++;
            }, 1000);
        }, 1000);
    } else {
        console.error('No active terminal for current project or WebSocket not connected.');
    }
  };