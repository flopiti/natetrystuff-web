import React, { useState, useEffect } from 'react';

interface Message {
  content: string;
  role: string;
  type: string;
}

const Chat = ({ conversation, loading, addToConversation, setMessages, runCommand }:any) => {

  const[commandsReadyToGo, setCommandsReadyToGo] = useState<string[]>([
    "git pull origin main",
    "git checkout -b",
    "git switch main",
    "git add .",
    "git commit -m ",
    "git push",
    "gh pr create --title ",
  ]);

  const[selectedOption, setSelectedOption] = useState<string>("");
  const[branchName, setBranchName] = useState<string>("");
  const[commitMessage, setCommitMessage] = useState<string>("");
  const[prTitle, setPrTitle] = useState<string>("");
  const[prBody, setPrBody] = useState<string>("");

  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  const handleRunCommand = () => {
    if (selectedOption === 'git pull origin main') {
      gitPullOriginMain();
    } 
    else if (selectedOption === 'git switch main') {
      gitSwitchOriginMain();
    }
    else if (selectedOption === 'git checkout -b') {
      gitCheckoutBranch();
    }
    else if (selectedOption === 'git add .') {
      gitAddAll();
    }
    else if (selectedOption === 'git commit -m ') {
      gitCommit();
    }
    else if (selectedOption === 'git push') {
      gitPush();
    }
    else if (selectedOption === 'gh pr create --title ') {
      createPullRequest();
    } 
    else {
      alert("Command not found");
    }
  };

  const gitSwitchOriginMain = () => {
    runCommand('git switch main');
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

  const gitAddAll = () => {
    runCommand('git add .');
  };

  const gitCommit = () => {
    if (commitMessage.trim()) {
      runCommand(`git commit -m "${commitMessage}"`);
    } else {
      alert('Please enter a commit message');
    }
  };

  const gitPush = () => {
    runCommand('git push');
  };

  const createPullRequest = () => {
    if (prTitle.trim() && prBody.trim()) {
      runCommand(`gh pr create --title "${prTitle}" --body "${prBody}"`);
    } else {
      alert('Please enter both PR title and body');
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
            {selectedOption === 'git commit -m ' && (
              <input 
                type="text" 
                className="ml-2 p-2 border border-gray-400"
                placeholder="Commit Message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              />
            )}
            {selectedOption === 'gh pr create --title ' && (
              <>
                <input 
                  type="text" 
                  className="ml-2 p-2 border border-gray-400"
                  placeholder="PR Title"
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                />
                <input 
                  type="text" 
                  className="ml-2 p-2 border border-gray-400"
                  placeholder="PR Body"
                  value={prBody}
                  onChange={(e) => setPrBody(e.target.value)}
                />
              </>
            )}
            <button onClick={handleRunCommand} className="ml-2 p-2 bg-blue-500 text-white">Run</button>
        </div> 
    </div>
</div>
  );
}

export default Chat;
