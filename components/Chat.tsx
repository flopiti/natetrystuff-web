import React, { useState, useEffect } from 'react';

interface Message {
  content: string;
  role: string;
  type: string;
}

const Chat = ({ conversation, loading, addToConversation, setMessages }:any) => {



  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  return (
    <div className="w-[40%] bg-red-200 h-full flex flex-col">
    <div className="w-full flex-grow bg-yellow-200 overflow-scroll">
        {loading && <p className="text-center text-black">Loading...</p>} {/* Show loading message */}
        {conversation?.slice(1).map((message:any, index:number) => (
            <div key={index} className={`text-black ${message.role === 'user' ? 'text-right' : 'text-left'}`}> 
                <p>{message.content}</p>
            </div>
        ))}
    </div>
    <div className="w-full h-1/5 bg-purple-20">
        <textarea className="w-full h-full text-black p-2 whitespace-pre-wrap break-words"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    addToConversation(e.currentTarget.value);
                    e.currentTarget.value = '';
                    e.preventDefault(); 
                }
            }} />
        <div className="w-full flex flex-row px-4 py-2">
            <select className="flex-grow p-2">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
            </select>
            <button onClick={() => alert(document.querySelector('select')?.value)} className="ml-2 p-2 bg-blue-500 text-white">Run</button>
        </div> 
    </div>
</div>
  );
}

export default Chat;