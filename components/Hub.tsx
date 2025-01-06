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
import { EAppNames } from '@/app/enums/global';
import CodeV2 from './CodeV2';

const Hub = () => {
    const[page, setPage] = useState('schedule');

    return (
        <Provider store={store}>
        <NavDropdown setPage={setPage}/>
        {
            page === EAppNames.SCHEDULE ? (
                <Schedule /> 
            ) : 
            page === EAppNames.MEALS ? (
                <Meals />
            ) : 
            page === EAppNames.CODE_CENTRAL ? (
                <CodeCentral />
            ) : 
            page === EAppNames.CHESS_BOARD ? (
                <ChessBoard />
            ) : 
            page === EAppNames.TODO ? (
                <ToDo />
            ) :
            page === EAppNames.TEXT_COMPLETE  ? (
                <TextComplete />
            ) :
            page === EAppNames.CODEV2 ? (
                <CodeV2 />
            ) : null
        }
        </Provider>
    );
}

export default Hub;