import React, { useState, useEffect } from 'react';

interface Message {
  content: string;
  role: string;
  type: string;
}

const Chat = ({ conversation, loading, addToConversation, setMessages, runCommand }:any) => {


  const[commandsReadyToGo, setCommandsReadyToGo] = useState<string[]>([
    "git pull origin main",
    "git switch origin main",
    "git checkout -b"
]);

  const[selectedOption, setSelectedOption] = useState<string>("");
  const[branchName, setBranchName] = useState<string>("");

  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  const handleRunCommand = () => {
    if (selectedOption === 'git pull origin main') {
      gitPullOriginMain();
    } 
    else if (selectedOption === 'git switch origin main') {
      gitSwitchOriginMain();
    }
    else if (selectedOption === 'git checkout -b') {
      gitCheckoutBranch();
    }
    else {
      alert("Command not found");
    }
  };

  const gitSwitchOriginMain = () => {
    runCommand('git switch origin main');
  }

  const gitPullOriginMain = () => {
    runCommand('git pull origin main');
  };

  const gitCheckoutBranch = () => {
    if (branchName.trim()) {
      runCommand(`git checkout -b ${branchName}`);
    } else {
      alert('Please enter a branch name');
    }
  };

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
            <select className="p-2 bg-blue-500 text-white"
                onChange={(e) => setSelectedOption(e.target.value)}
            >
                {commandsReadyToGo.map((command:string, index:number) => (
                    <option key={index}>{command}</option>
                ))}
            </select>
            {selectedOption === 'git checkout -b' && (
              <input 
                type="text" 
                className="ml-2 p-2 border border-gray-400"
                placeholder="Branch Name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            )}
            <button onClick={handleRunCommand} className="ml-2 p-2 bg-blue-500 text-white">Run</button>
        </div> 
    </div>
</div>
  );
}

export default Chat;