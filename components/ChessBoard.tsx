import React from 'react';
import { Chessboard } from 'react-chessboard';

const ChessBoard = () => {
    return (
        <div className="h-[70vh] w-[600px] mx-15 my-4">
            <h1>Chess Board</h1>
            <div className="w-full h-full">
            <Chessboard id="BasicBoard"  />

            </div>
        </div>
    );
}

export default ChessBoard;