import { use, useEffect, useState } from "react";

const CodeCentral = () => {

    const [springBootFiles, setSpringBootFiles] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [selectedFileContent, setSelectedFileContent] = useState('');

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

    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "code": the code snippet that you think is the answer}. If the code is not a coding solution,
    simply do not include the property in the JSON object. 
    `;

    useEffect(() => {
        getSpringBootFiles();
        
    }
    ,[])

    const [conversation, setConversation] = useState<any[]>([{
        content: PROMPT,
        role: 'system',
        type: 'text'
    }]);

    const askChat = async (conversation_: string[]) => {
        const res = await fetch('api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
            body: JSON.stringify({ conversation_ })
        });

        const response = await res.json();
        setConversation([...conversation_, {content: response.chatCompletion.choices[0].message.content, role: 'assistant', type: 'text'}]);
    }

    const addToConversation = (message: string) => {
        askChat([...conversation, {content:message, role: 'user', type: 'text'}]);
    }

    console.log(conversation)
    const getFile = async (fileName:string) => {
        const res = await fetch(`api/get-file?fileName=${fileName}`, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            },
        });

        const data = await res.json();
        return data.data;
    }


    const handleFileSelect = async (fileName:string) => {
        setSelectedFileName(fileName);
        const content = await getFile(fileName);
        setSelectedFileContent(content);
      };

    return (
        <div className="h-[70vh] border-2 border-white w-full flex flex-row">
            <div>
            {springBootFiles.length > 0 && springBootFiles.map((springBootClass:any) => {
                return (
                <div key={springBootClass.name}>
                    <h1>{springBootClass.name}</h1>
                    {springBootClass.files.map((file:any, index:any) => (
                    <div key={index} onClick={() => handleFileSelect(file)}>
                        <p style={{ cursor: 'pointer', fontWeight: selectedFileName === file ? 'bold' : 'normal' }}>
                        {file}
                        </p>
                    </div>
                    ))}
                </div>
                );
            })}

            </div>
            <div className="w-1/2 bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
                {selectedFileContent && (
                    <div>
                    <pre>{selectedFileContent}</pre>
                    </div>
                )}
            </div>
            <div className="w-[30%] bg-red-200 h-full flex flex-col">
                <div className="w-full h-4/5 bg-yellow-200">
                {
                    conversation?.slice(1).map((message, index) => (
                        <div key={index} className={`text-black ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <p>{message.content}</p>
                        </div>
                    ))
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