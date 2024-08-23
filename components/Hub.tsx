'use client';

import { useState } from "react";
import Meals from "./Meals";
import Schedule from "./Schedule";
import CodeCentral from "./CodeCentral";

const Hub = () => {
    const[page, setPage] = useState('schedule')

    return (
        <>
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
            <button className="mx-2" onClick={() => setPage('/code-central')}>Code Central</button>
        </div>
        {
            page === 'schedule' ? (
                <Schedule /> 
            ) : 
            page === 'meals'? (
                <Meals />
            ) : 
            page === '/code-central' ? (
                <CodeCentral/>
            ) : null
        }
        </>
    );
}

export default Hub;
