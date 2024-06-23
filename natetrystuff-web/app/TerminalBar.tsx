import React from 'react';

const TerminalBar = ({ terminals }: { terminals: number[] }) => {
  return (
    <div className="bg-gray-200 p-2 mb-4">
      {terminals.length === 0 && <p>No open terminals</p>}
      {terminals.map((terminal, idx) => (
        <span key={idx} className="mr-2 bg-gray-300 p-2 rounded">
          Terminal {terminal}
        </span>
      ))}
    </div>
  );
};

export default TerminalBar;
