//DESC: This file defines a React component for a chat interface that handles Git operations using various services.
import { generateBranchName } from "@/services/chatService";
import { getGitBranch, gitCheckoutBranch, gitSendIt, goMain } from "@/services/gitService";
import { addMessage } from "@/slices/MessagesSlice";
import { setBranchName } from "@/slices/ProjectSlice";
import { AppDispatch, RootState } from "@/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Chat = ({
  loading,
  runCommand,
  commitMessage,
  prTitle,
  prBody,
  setFeatbugDescription,
}: any) => {
  const [commandsReadyToGo, setCommandsReadyToGo] = useState<string[]>([
    "gh pr create --title ",
    "git-send-it",
  ]);
  const dispatch: AppDispatch = useDispatch();
  const conversation = useSelector((state: RootState) => state.Messages.messages);
  const { currentProject, projectDir, branchName } = useSelector((state: RootState) => state.Projects);

  const [selectedOption, setSelectedOption] = useState<string>("no selected option");
  
  const [commitMessageEdit, setCommitMessage] = useState<string>( commitMessage || ""  );
  const [prTitleEdit, setPrTitle] = useState<string>(prTitle || "");
  const [prBodyEdit, setPrBody] = useState<string>(prBody || "");

  const [currentTextInput, setCurrentTextInput] = useState<string>("");
  const [newChangeBranch, setNewChangeBranch] = useState<string>("");
  

  useEffect(() => {
    if (branchName)
    {
    setCommandsReadyToGo([
      "gh pr create --title ",
      "git-send-it",
    ]);
    }
  }, [branchName]);

  useEffect(() => {
    setCommitMessage(commitMessage);
    setPrTitle(prTitle);
    setPrBody(prBody);
  }, [commitMessage, prTitle, prBody]);

  const createPullRequest = () => {
    if (prTitleEdit.trim() && prBodyEdit.trim()) {
      runCommand(`gh pr create --title "${prTitleEdit}" --body "${prBodyEdit}"`);
    } else {
      alert("Please enter both PR title and body");
    }
  };
  const handleRunCommand = () => {
    console.log('run')
    console.log('branch name is ' + branchName);
    if (!currentProject){
      alert("Please select a project first");
      return;
    }
    if (selectedOption === "gh pr create --title ") {
      createPullRequest();

      
    } else if (selectedOption === "git-send-it" && branchName) {
          console.log('lets use the service')

      gitSendIt(commitMessageEdit, branchName, currentProject.name);
    } else {
      alert("Command not found");
    }
    if (branchName) {
      getGitBranch(currentProject.name, projectDir).then((branchName) => {
        dispatch(setBranchName(branchName));
      }
      );
    }
  }

  const handleStartButton = async () => {
    
    if(!currentProject){
      alert("Please select a project first");
      return;
    }
    setFeatbugDescription(currentTextInput); // Save the current text input
    const newBranchName = await generateBranchName(currentTextInput);
    setCurrentTextInput("");
    await goMain(currentProject.name);
    await gitCheckoutBranch(newBranchName,currentProject.name);
    getGitBranch(currentProject.name, projectDir).then((branchName) => {
      dispatch(setBranchName(branchName));
    }
    );

    setSelectedOption("git-send-it");
  };



  return (
    <div className="w-1/3 bg-gray-100 h-full flex flex-col shadow-lg">
      <div className="w-full flex-grow bg-white overflow-scroll p-4 border-b border-gray-300">
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {conversation?.slice(1).map((message: any, index: number) => (
          <div
            key={index}
            className={`text-gray-800 ${
              message.role === "user" ? "text-right" : "text-left"
            } mt-2`}
          >
            <p className="bg-blue-100 p-2 rounded-lg inline-block max-w-xs">
              {message.content}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 flex flex-col justify-between p-4">
        <textarea
          className="w-full text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentTextInput}
          onChange={(e) => setCurrentTextInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
              dispatch(addMessage({ content: e.currentTarget.value, role: "user", type: "text" }));
              setCurrentTextInput("");
              e.preventDefault();
            }
          }}
        />
        <div className="w-full flex flex-row items-center mt-2 space-x-2 flex-wrap">
          <select
            className="p-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedOption(e.target.value)}
            value={selectedOption}
          >
            <option value="no selected option">Select a command</option>
            {commandsReadyToGo.map((command: string, index: number) => (
              <option key={index} value={command}>
                {command}
              </option>
            ))}
          </select>
          {selectedOption === "git checkout -b" && (
            <input
              type="text"
              className="p-2 border border-gray-400 text-gray-700 rounded-md"
              placeholder="Branch Name"
              value={newChangeBranch}
              onChange={(e) => setNewChangeBranch(e.target.value)}
            />
          )}
          {selectedOption === "git commit -m " && (
            <input
              type="text"
              className="p-2 border border-gray-400 text-gray-700 rounded-md"
              placeholder="Commit Message"
              value={commitMessageEdit}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
          )}
          {selectedOption === "gh pr create --title " && (
            <>
              <input
                type="text"
                className="p-2 border border-gray-400 text-gray-700 rounded-md"
                placeholder="PR Title"
                value={prTitleEdit}
                onChange={(e) => setPrTitle(e.target.value)}
              />
              <input
                type="text"
                className="p-2 border border-gray-400 text-gray-700 rounded-md ml-2"
                placeholder="PR Body"
                value={prBody}
                onChange={(e) => setPrBody(e.target.value)}
              />
            </>
          )}
          <button
            onClick={handleRunCommand}
            className="p-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={selectedOption === "no selected option"}
          >
            Run
          </button>
          <button
            onClick={handleStartButton}
            className="p-2 bg-green-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
