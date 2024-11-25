//DESC: This component represents a single terminal instance, providing UI for terminal operation, closure, and command execution.
import React from "react";

interface TerminalInstanceProps {
  id: number;
  isSelected: boolean;
  closeTerminal: (id: number) => void;
  runCommand: (command: string) => void;
}

const TerminalInstance: React.FC<TerminalInstanceProps> = ({
  id,
  isSelected,
  closeTerminal,
  runCommand,
}) => {
  return (
    <div className={`${isSelected ? "" : "hidden"}`}>
      <div id={`terminal-${id}`} className="h-[20vh] w-full mb-4 overflow-auto" />
      <button
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => closeTerminal(id)}
      >
        Close Terminal {id}
      </button>
      <button
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() =>
          runCommand("cd /dev-projects/natetrystuff-web && npm run dev")
        }
      >
        Run dev environment
      </button>
      <button
        className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        onClick={() =>
          runCommand(
            "cd /dev-projects/natetrystuff-api/natetrystuff && mvn spring-boot:run -Dspring-boot.run.profiles=local"
          )
        }
      >
        Run API in dev
      </button>
    </div>
  );
};

export default TerminalInstance;
