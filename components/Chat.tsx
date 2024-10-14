import { askChatNoStream, fetchAndAskChatGPT, generateBranchName } from "@/services/chatService";
import { gitCheckoutBranch, gitSendIt, goMain } from "@/services/gitService";
import React, { useState, useEffect } from "react";

const Chat = ({
  conversation,
  loading,
  addToConversation,
  setMessages,
  runCommand,
  getBranch,
  branch,
  commitMessage,
  prTitle,
  prBody,
  selectedProject,
  handleNewHighlitghtedFiles,
  handleNewSelectedFile,
}: any) => {
  const [commandsReadyToGo, setCommandsReadyToGo] = useState<string[]>([
    "gh pr create --title ",
    "git-send-it",
  ]);

  const [selectedOption, setSelectedOption] = useState<string>("no selected option");
  const [branchName, setBranchName] = useState<string>(branch);
  
  const [commitMessageEdit, setCommitMessage] = useState<string>( commitMessage || ""  );
  const [prTitleEdit, setPrTitle] = useState<string>(prTitle || "");
  const [prBodyEdit, setPrBody] = useState<string>(prBody || "");

  const [currentTextInput, setCurrentTextInput] = useState<string>("");
  const [newChangeBranch, setNewChangeBranch] = useState<string>("");
  const [featbugDescription, setFeatbugDescription] = useState<string>("");
  


  useEffect(() => {
    console.log('featbugDescription:', featbugDescription);
    if (featbugDescription) {
      console.log('fetching and asking ChatGPT');
      fetchAndAskChatGPT(featbugDescription, selectedProject.name, handleNewHighlitghtedFiles, handleNewSelectedFile);
    }
  }, [featbugDescription]);

  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  useEffect(() => {
    setBranchName(branch);
    setCommandsReadyToGo([
      "gh pr create --title ",
      "git-send-it",
    ]);
  }, [branch]);

  useEffect(() => {
    setCommitMessage(commitMessage);
    setPrTitle(prTitle);
    setPrBody(prBody);
  }, [commitMessage, prTitle, prBody]);

  const handleRunCommand = () => {
    if (selectedOption === "gh pr create --title ") {
      createPullRequest();
    } else if (selectedOption === "git-send-it") {
      gitSendIt(commitMessageEdit, branchName, selectedProject.name);
    } else {
      alert("Command not found");
    }
    if (branchName) {
      getBranch();
    }
  };

  const handleStartButton = async () => {
    setFeatbugDescription(currentTextInput); // Save the current text input
    const newBranchName = await generateBranchName(currentTextInput);
    setCurrentTextInput("");
    await goMain(selectedProject.name);
    await gitCheckoutBranch(newBranchName,selectedProject.name);
    getBranch();
    setSelectedOption("git-send-it");
  };


  const createPullRequest = () => {
    if (prTitleEdit.trim() && prBodyEdit.trim()) {
      runCommand(`gh pr create --title "${prTitleEdit}" --body "${prBodyEdit}"`);
    } else {
      alert("Please enter both PR title and body");
    }
  };

  return (
    <div className="w-2/5 bg-gray-100 h-full flex flex-col shadow-lg">
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
              addToConversation(e.currentTarget.value);
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
