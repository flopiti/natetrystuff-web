//DESC: This file defines the Hub component used for navigating between Schedule, Meals, Code Central, and Chess Board components.
'use client';
import { Provider } from 'react-redux';
import store from '@/store';
import { useState } from "react";
import Meals from "./Meals";
import Schedule from "./Schedule";
import CodeCentral from "./CodeCentral";
import ChessBoard from "./ChessBoardComponent";


const Hub = () => {
    const[page, setPage] = useState('schedule')

    return (
        <Provider store={store}>
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
            <button className="mx-2" onClick={() => setPage('/code-central')}>Code Central</button>
            <button className="mx-2" onClick={() => setPage('chess-board')}>Chess Board</button>
        </div>
        {
            page === 'schedule' ? (
                <Schedule /> 
            ) : 
            page === 'meals'? (
                <Meals />
            ) : 
            page === '/code-central' ? (
                <CodeCentral />
            ) : 
            page === 'chess-board' ? (
                <ChessBoard />
            ) : null
        }
        </Provider>
    );
}

export default Hub;
