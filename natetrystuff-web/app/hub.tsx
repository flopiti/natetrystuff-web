'use client';

import { useState } from "react";
import Schedule from "./schedule";
import Meals from "./meals";
import Code from "./code";

const Hub = () => {
    const[page, setPage] = useState('schedule')

    return (
        <>
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
            <button className="mx-2" onClick={() => setPage('code')}>Code</button>
        </div>
        {
            page === 'schedule' ? (
                <Schedule /> 
            ) : 
            page === 'meals'? (
                <Meals />
            ) : 
            page === 'code' ? (
                <Code/>
            ) : null

        }
        </>
    );
    }
export default Hub;
