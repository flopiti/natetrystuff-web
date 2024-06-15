'use client';

import { useState } from "react";
import Schedule from "./schedule";
import Meals from "./meals";
import Code from "./code";
import DevDb from "./devdb";
import CodeCentral from "./code-central";
import CodeEye from "./code-eye";

const Hub = () => {
    const[page, setPage] = useState('schedule')

    return (
        <>
        <div>
            <button className="mx-2" onClick={() => setPage('schedule')}>Schedule</button>
            <button className="mx-2" onClick={() => setPage('meals')}>Meals</button>
            <button className="mx-2" onClick={() => setPage('code')}>Code</button>
            <button className="mx-2" onClick={() => setPage('/dev-db')}>Dev DB</button>
            <button className="mx-2" onClick={() => setPage('/code-central')}>Code Central</button>
            <button className="mx-2" onClick={() => setPage('code-eye')}>Code Eye</button>
            <button className="mx-2" onClick={() => setPage('ssh-connect')}>SSH Connect</button>
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
            ) :
            page === '/dev-db' ? (
                <DevDb/>
            ) : 
            page === '/code-central' ? (
                <CodeCentral/>
            ) :
            page === 'code-eye' ? (
                <CodeEye/>
            ) : 
            page === 'ssh-connect' ? (
                <div>SSH Connect Component Goes Here</div> 
            ) : null

        }
        </>
    );
}

export default Hub;
