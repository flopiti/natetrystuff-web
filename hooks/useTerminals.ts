import { useState } from "react";
import { Terminal } from "xterm";

const useTerminals = () => {

    const [terminals, setTerminals] = useState<{ id: number; terminalInstance: Terminal | null; ws: WebSocket | null }[]>([]);
    const [selectedTerminal, setSelectedTerminal] = useState<number | null>(null);
    const [devTerminalId, setDevTerminalId] = useState<number | null>(null);
    const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);

    return {
        terminals,
        setTerminals,
        selectedTerminal,
        setSelectedTerminal,
        devTerminalId,
        setDevTerminalId,
        isTerminalOpen,
        setIsTerminalOpen
    };
}

export default useTerminals;
    