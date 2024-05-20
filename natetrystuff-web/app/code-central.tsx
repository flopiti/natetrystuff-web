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

    const [conversation, setConversation] = useState<string[]>([]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, message]);
    }

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
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
            <div className="w-1/2 bg-blue-200 h-full">

            </div>
            <div className="w-[30%] bg-red-200 h-full flex flex-col">
                <div className="w-full h-4/5 bg-yellow-200">
                    {
                        conversation.map((message, index) => {
                            return (
                                <div key={index} className="text-black">
                                    <p>{message}</p>
                                </div>
                            );
                        })
                    }
                </div>
                <div className="w-full h-1/5 bg-purple-200">
                    <input type="text" className="w-full h-full text-black"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                addToConversation(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}/>
            
                </div>
            </div>
        </div>
    );
    }

export default CodeCentral;