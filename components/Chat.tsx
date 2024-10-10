import { generateBranchName } from "@/services/chatService";
import { gitCheckoutBranch, gitSendIt, goMain } from "@/services/gitService";
import React, { useState, useEffect } from "react";

interface Message {
  content: string;
  role: string;
  type: string;
}

const Chat = ({
  conversation,
  loading,
  addToConversation,
  setMessages,
  runCommand,
  getBranch,
  branch,
  commitMessage,
  prTitle: initialPrTitle,
  prBody: initialPrBody,
  selectedProject,
}: any) => {
  const [commandsReadyToGo, setCommandsReadyToGo] = useState<string[]>([
    "git pull origin main",
    "git checkout -b",
    "git switch main",
    "git add .",
    "git commit -m ",
    `git push origin ${branch}`,
    "gh pr create --title ",
    "git-send-it",
  ]);

  const [selectedOption, setSelectedOption] =
    useState<string>("no selected option");
  const [branchName, setBranchName] = useState<string>(branch);
  const [commitMessageState, setCommitMessage] = useState<string>(
    commitMessage || ""
  );
  const [prTitle, setPrTitle] = useState<string>(initialPrTitle || "");
  const [prBody, setPrBody] = useState<string>(initialPrBody || "");
  const [currentTextInput, setCurrentTextInput] = useState<string>("");
  const [newChangeBranch, setNewChangeBranch] = useState<string>("");

  useEffect(() => {
    setMessages(conversation);
  }, [conversation]);

  useEffect(() => {
    setBranchName(branch);
    setCommandsReadyToGo([
      "git pull origin main",
      "git checkout -b",
      "git switch main",
      "git add .",
      "git commit -m ",
      `git push origin ${branch}`,
      "gh pr create --title ",
      "git-send-it",
    ]);
  }, [branch]);

  useEffect(() => {
    setCommitMessage(commitMessage);
    setPrTitle(initialPrTitle);
    setPrBody(initialPrBody);
  }, [commitMessage, initialPrTitle, initialPrBody]);

  const handleRunCommand = () => {
    console.log(`Running command: ${selectedOption}`);

    if (selectedOption === "git pull origin main") {
      gitPullOriginMain();
    } else if (selectedOption === "git switch main") {
      gitSwitchOriginMain();
    } else if (selectedOption === "git checkout -b") {
      gitCheckoutBranch(newChangeBranch, selectedProject.name);
    } else if (selectedOption === "git add .") {
      gitAddAll();
      setSelectedOption("git commit -m ");
    } else if (selectedOption === "git commit -m ") {
      gitCommit();
      setSelectedOption(`git push origin ${branch}`);
    } else if (selectedOption === `git push origin ${branch}`) {
      gitPush();
      setSelectedOption("gh pr create --title ");
    } else if (selectedOption === "gh pr create --title ") {
      createPullRequest();
    } else if (selectedOption === "git-send-it") {
      gitSendIt(commitMessageState, branchName, selectedProject.name);
    } else {
      alert("Command not found");
    }
    if (branchName) {
      getBranch();
    }
  };

  const handleStartButton = async () => {
    const newBranchName = await generateBranchName(currentTextInput);
    setCurrentTextInput("");
    await goMain(selectedProject.name);
    console.log('just ran goMain');
    console.log('now checking out branch:', newBranchName);
    await gitCheckoutBranch(newBranchName,selectedProject.name);
    console.log('just ran gitCheckoutBranch about to getBranch');
    getBranch();
    setSelectedOption("git-send-it");
  };




  const gitSwitchOriginMain = () => {
    runCommand("git switch main");
    setTimeout(() => {
      getBranch();
    }, 5000);
  };

  const gitPullOriginMain = () => {
    runCommand("git pull origin main");
  };



  const gitAddAll = () => {
    runCommand("git add .");
  };

  const gitCommit = () => {
    if (commitMessageState.trim()) {
      runCommand(`git commit -m "${commitMessageState}"`);
    } else {
      alert("Please enter a commit message");
    }
  };

  const gitPush = () => {
    console.log(`Pushing to branch: ${branchName}`);
    runCommand(`git push origin ${branchName}`);
  };

  const createPullRequest = () => {
    if (prTitle.trim() && prBody.trim()) {
      runCommand(`gh pr create --title "${prTitle}" --body "${prBody}"`);
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
      <div className="w-full h-1/5 bg-gray-200 flex flex-col justify-between p-4">
        <textarea
          className="w-full h-3/5 text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="w-full flex flex-row items-center mt-2 space-x-2">
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
              value={commitMessageState}
              onChange={(e) => setCommitMessage(e.target.value)}
            />
          )}
          {selectedOption === "gh pr create --title " && (
            <>
              <input
                type="text"
                className="p-2 border border-gray-400 text-gray-700 rounded-md"
                placeholder="PR Title"
                value={prTitle}
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
