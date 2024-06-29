import React from 'react';

const TerminalBar = ({ terminals, closeTerminal }: { terminals: number[], closeTerminal: (index: number) => void }) => {
  return (
    <div className="bg-gray-200 p-2 mb-4">
      {terminals.length === 0 && <p>No open terminals</p>}
      {terminals.map((terminal, idx) => (
        <span key={idx} className="mr-2 bg-gray-300 p-2 rounded inline-block">
          Terminal {terminal}
          <button className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => closeTerminal(idx)}>Close</button>
        </span>
      ))}
    </div>
  );
};

export default TerminalBar;
