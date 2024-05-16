

import React, { useEffect, useState } from 'react';

const DevDb = () => {

    const [tables, setTables] = useState([]);
    const[chosenSelectTable, setChosenSelectTable] = useState('')
    const[chosenDeleteTable, setChosenDeleteTable] = useState('')
    const[chosenDescribeTable, setChosenDescribeTable] = useState('')


    const getTables = () => {
        fetch('/api/db/get-tables')
        .then(response => response.json())
        .then(data => {
            setTables(data)
        })
    }

    const selectAll = () => {
        
    }
    const deleteAll = () => {

    }

    const describe = () => {

    }

    useEffect(() => {
        getTables()
    }
    , [])

  return (
    <div>
      <div>
        <button>Select All</button>
        <label>Table: </label>
        <select onChange={(e) => setChosenSelectTable(e.target.value)}>
                <option value="" >Select Table</option>
                {
                    tables.map(table => (
                        <option value={table}>{table}</option>
                    ))
                }
              </select>
      </div>
      <div>
        <button>Delete All</button>
        <label>Table: </label>
        <select onChange={(e) => setChosenDeleteTable(e.target.value)}>
                <option value="" >Select Table</option>
                {
                    tables.map(table => (
                        <option value={table}>{table}</option>
                    ))
                }
              </select>
      </div>
      <div>
        <button>Describe</button>
        <label>Table: </label>
        <select onChange={(e) => setChosenDescribeTable(e.target.value)}>
                <option value="" >Select Table</option>
                {
                    tables.map(table => (
                        <option value={table}>{table}</option>
                    ))
                }
              </select>
      </div>
      <div>
        <button>Delete All</button>
      </div>
      <div>
        <button>DB Details</button>
      </div>

    </div>
  );
};

export default DevDb;
