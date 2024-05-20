import { use, useEffect, useState } from "react";

const CodeCentral = () => {

    const [springBootFiles, setSpringBootFiles] = useState([]);
    const getSpringBootFiles = async () => {
        const res = await fetch('api/spring-boot-classes', {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store' 
            },
        });

    const springBootFiles = await res.json();
    setSpringBootFiles(springBootFiles.data);
    }
    console.log(springBootFiles)
    useEffect(() => {
        getSpringBootFiles();
        
    }
    ,[])
    return (
        <div className="h-[70vh] border-2 border-white w-full">
            <div className="w-1/5 bg-green-500 h-full overflow-hidden overflow-y-scroll">
                {
                    springBootFiles.length > 0 && springBootFiles.map((springBootClass:any) => {
                        return (
                            <div key={springBootClass.name}>
                                <h1>{springBootClass.name}</h1>
                                {
                                    springBootClass.files.map(
                                        (file:any, index:number) => (
                                            <div key={index}>
                                                <p>{file}</p>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        );
                    })

                }
            </div>
        </div>
    );
    }

export default CodeCentral;