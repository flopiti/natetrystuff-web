import React from 'react';

const TerminalBar = ({ terminals, selectedTerminal, setSelectedTerminal, openTerminal }: { terminals: number[], selectedTerminal: number | null, setSelectedTerminal: (id: number) => void, openTerminal: () => void }) => {
  return (
    <div className="bg-gray-200 p-2 mb-4">
      {terminals.length === 0 && <p>No open terminals</p>}
      {terminals.map((terminal, idx) => (
        <span
          key={idx}
          className={`mr-2 p-2 rounded cursor-pointer ${selectedTerminal === terminal ? 'bg-blue-300' : 'bg-gray-300'}`}
          onClick={() => setSelectedTerminal(terminal)}
        >
          Terminal {terminal}
        </span>
      ))}
      <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openTerminal}>Open another Terminal</button>
    </div>
  );
};

export default TerminalBar;
