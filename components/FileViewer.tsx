//DESC: This file contains a React component for viewing and managing file and chat code differences.
import { unescapeString } from '@/app/utils';
import { RootState } from '@/store';
import { diffLines } from 'diff';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, hopscotch } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface FileViewerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFileContent: string;
  selectedChatCode: string | null;
  selectedFileName: string | null;
  replaceCode: () => void;
  setSelectedChatCode: (code: string) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  activeTab,
  setActiveTab,
  selectedFileContent,
  selectedChatCode,
  selectedFileName,
  replaceCode,
  setSelectedChatCode,
}) => {
  const loading = useSelector((state: RootState) => state.Messages.loading);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const chatCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatCodeRef.current) {
      chatCodeRef.current.scrollTop = chatCodeRef.current.scrollHeight;
    }
  }, [selectedChatCode]);

  let linesOfSelectedChatCode: any[] = [];
  const linesOfSelectedFileContent = selectedFileContent.split('\n');
  let displayLines: any = [];
  let trailingRemovedLines: any[] = [];

  const removeLine = (lineNumber: number, line: string) => {
    const newCode = linesOfSelectedChatCode.filter((_, index) => index !== lineNumber - 1);
    setSelectedChatCode(newCode.join('\n'));
  };

  const addLine = (line: string, lineNumber: number) => {
    const newCode = [
      ...linesOfSelectedChatCode.slice(0, lineNumber - 1),
      line,
      ...linesOfSelectedChatCode.slice(lineNumber - 1),
    ];
    setSelectedChatCode(newCode.join('\n'));
  };

  if (selectedChatCode) {
    linesOfSelectedChatCode = selectedChatCode.split('\n');
    let addedLines = [];
    let removedLines = [];
    let untouchedLines = [];
    let lineNumber = 1;

    for (let i = 0; i < linesOfSelectedChatCode.length; i++) {
      if (!linesOfSelectedFileContent.includes(linesOfSelectedChatCode[i])) {
        addedLines.push({ lineNumber: lineNumber, line: linesOfSelectedChatCode[i] });
      } else {
        untouchedLines.push({ lineNumber: lineNumber, line: linesOfSelectedChatCode[i] });
      }
      lineNumber++;
    }
    for (let i = 0; i < linesOfSelectedFileContent.length; i++) {
      if (!linesOfSelectedChatCode.includes(linesOfSelectedFileContent[i])) {
        removedLines.push({ lineNumber: i + 1, line: linesOfSelectedFileContent[i] });
      }
    }

    const combinedLines = [...untouchedLines, ...addedLines].sort(
      (a, b) => a.lineNumber - b.lineNumber
    );
    const maxLineNumber = Math.max(...combinedLines.map((line) => line.lineNumber), 0);
    trailingRemovedLines = removedLines.filter((removed) => removed.lineNumber > maxLineNumber);
    displayLines = [...combinedLines].map(({ lineNumber, line }) => {
      const removedLine = removedLines.find((removed) => removed.lineNumber === lineNumber);
      return (
        <Fragment key={lineNumber}>
          {removedLine && (
            <>
              <div style={{ backgroundColor: 'lightcoral' }}>
                <span className="text-gray-500">{lineNumber}: </span>
                {line}
              </div>
              <AddButton lineNumber={lineNumber} line={removedLine.line} addLine={addLine} />
            </>
          )}
          <div
            style={{
              backgroundColor: addedLines.some((added) => added.lineNumber === lineNumber)
                ? 'lightgreen'
                : 'transparent',
            }}
          >
            <span className="text-gray-500">{lineNumber}: </span>
            {line}
          </div>
          {addedLines.some((added) => added.lineNumber === lineNumber) && (
            <RemoveButton removeLine={removeLine} line={line} lineNumber={lineNumber} />
          )}
        </Fragment>
      );
    });
  }

  const handleReplaceCode = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await replaceCode();
      setSuccessMessage('Code replacement was successful.');
    } catch (error) {
      setErrorMessage('Failed to replace code.');
    }
  };

  console.log(displayLines);
  return (
    <div className="flex-grow flex-shrink flex-basis-0 bg-[#2f2f2f] flex flex-col h-full overflow-y-scroll text-black text-xs p-2 scrollbar-none" style={{ maxWidth: '750px' }}>
      <div className="flex bg-gray-100 p-2 scrollbar-none">
        <button
          className={`flex-1 text-center p-2 ${
            activeTab === 'file' ? 'bg-[#2f2f2f] text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => setActiveTab('file')}
          disabled={loading}
        >
          File
        </button>
        <button
          className={`flex-1 text-center p-2 ${
            activeTab === 'chat' ? 'bg-[#2f2f2f] text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => setActiveTab('chat')}
          disabled={loading}
        >
          Chat
        </button>
      </div>
      {activeTab === 'chat' && !loading && (
        <button className="bg-[#2f2f2f] text-white p-2" onClick={handleReplaceCode}>
          Replace code in {selectedFileName}
        </button>
      )}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <div
        className="w-full bg-[#2f2f2f] h-full overflow-y-scroll text-black text-xs p-2 scrollbar-none"
        ref={chatCodeRef}
      >
        {loading && (
          <div>
            <SyntaxHighlighter language="javascript" style={materialDark}>
              {selectedChatCode ? unescapeString(selectedChatCode) : ''}
            </SyntaxHighlighter>
          </div>
        )}
        {!loading && activeTab === 'file' && selectedFileContent && (
          <SyntaxHighlighter language="javascript" style={materialDark}>
            {selectedFileContent}
          </SyntaxHighlighter>
        )}
        {!loading && activeTab === 'chat' && selectedChatCode && (
          <div className="h-full inline-block">
            <pre key={selectedChatCode} style={{ color: 'white' }}>
              {displayLines}
              {trailingRemovedLines.map(({ lineNumber, line }) => (
                <Fragment key={lineNumber}>
                  <div key={lineNumber} style={{ backgroundColor: 'lightcoral' }}>
                    <span className="text-gray-500">{lineNumber}: </span>
                    {line}
                  </div>
                  <AddButton lineNumber={lineNumber} line={line} addLine={addLine} />
                </Fragment>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const AddButton: React.FC<any> = ({ line, lineNumber, addLine }) => {
  return (
    <button className="bg-[#2f2f2f] text-white p-2" onClick={() => addLine(line, lineNumber)}>
      Add code
    </button>
  );
};

const RemoveButton: React.FC<any> = ({ line, lineNumber, removeLine }) => {
  return (
    <button
      key={lineNumber}
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => removeLine(lineNumber, line)}
    >
      Remove code {lineNumber}
    </button>
  );
};

export default FileViewer;
