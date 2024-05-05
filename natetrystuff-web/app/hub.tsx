'use client';

import { useState } from "react";
import Schedule from "./schedule";
import Meals from "./meals";

const Hub = () => {
    const[page, setPage] = useState('schedule')

    return (
        <>
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
        </div>
        {
            page === 'schedule' ? (
                <Schedule /> 
            ) : 
            page === 'meals'? (
                <Meals />
            )
            : null

        }
        </>
    );
    }
export default Hub;
