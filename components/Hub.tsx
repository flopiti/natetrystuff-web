//DESC: This file defines the Hub component used for navigating between Schedule, Meals, Code Central, Chess Board, and ToDo components.
'use client';
import { Provider } from 'react-redux';
import store from '@/store';
import { useState } from "react";
import Meals from "./Meals";
import Schedule from "./Schedule";
import CodeCentral from "./CodeCentral";
import ChessBoard from "./ChessBoard";
import ToDo from "./ToDo";
import TextComplete from './TextComplete';
import NavDropdown from './UI/NavDropdown';

const Hub = () => {
    const[page, setPage] = useState('schedule');

    return (
        <Provider store={store}>
        <NavDropdown />
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
            <button className="mx-2" onClick={() => setPage('code-central')}>Code Central</button>
            <button className="mx-2" onClick={() => setPage('chess-board')}>Chess Board</button>
            <button className="mx-2" onClick={() => setPage('todo')}>ToDo</button>
            <button className="mx-2" onClick={() => setPage('text-complete')}>Text Complete</button>
        </div>
        {
            page === 'schedule' ? (
                <Schedule /> 
            ) : 
            page === 'meals' ? (
                <Meals />
            ) : 
            page === 'code-central' ? (
                <CodeCentral />
            ) : 
            page === 'chess-board' ? (
                <ChessBoard />
            ) : 
            page === 'todo' ? (
                <ToDo />
            ) :
            page === 'text-complete'  ? (
                <TextComplete />
            ) :
            null
        }
        </Provider>
    );
}

export default Hub;