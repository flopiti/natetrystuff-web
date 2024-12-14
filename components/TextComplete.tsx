import { chatCleanSentence } from '@/services/chatService';
import React, { useEffect, useState } from 'react';

const TextComplete = () => {

    const [text, setText] = useState('');
    const [cleanedText, setCleanedText] = useState('');
    useEffect(() => {
        chatCleanSentence(text).then((data) => {
            console.log(data)
            if (data)
            {
                setCleanedText(data);

            }
        });
    }
    , [text]);




    return (
        <div className="h-[70vh] w-[600px] mx-15 my-4 flex items-center justify-center">
            <div className="w-full h-full">
                <h2>Cleaned Text:</h2>
                <textarea 
                    className="w-full p-2 border  text-black  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cleanedText}
                    readOnly
                />

                <h2>Original Text:</h2>
                <textarea 
                    className="w-full p-2  text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
        </div>
    );
    
}

export default TextComplete;