import React from 'react';
import { Chessboard } from 'react-chessboard';

const ChessBoardComponent = () => {
    return (
        <div className="h-[70vh] w-full mx-15 my-4">
            <h1>Chess Board</h1>
            <Chessboard id="BasicBoard" className="w-full h-full" />
        </div>
    );
}

export default ChessBoardComponent;