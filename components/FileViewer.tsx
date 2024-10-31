// This file contains a React component for viewing and managing file and chat code differences.
import { unescapeString } from '@/app/utils';
import { RootState } from '@/store';
import { diffLines } from 'diff';
import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

  const removeLines = (startLineNumber: number, numLines: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = lines.filter(
      (_, index) => index < startLineNumber - 1 || index >= startLineNumber - 1 + numLines
    );
    setSelectedChatCode(newCode.join('\n'));
  };

  const addLines = (linesToAdd: string[], lineNumber: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = [
      ...lines.slice(0, lineNumber - 1),
      ...linesToAdd,
      ...lines.slice(lineNumber - 1),
    ];
    setSelectedChatCode(newCode.join('\n'));
  };

  let displayLines: any[] = [];

  if (selectedChatCode) {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    let lineNumber = 1;

    let i = 0;
    while (i < diff.length) {
      const part = diff[i];

      if (part.added || part.removed) {
        const isAdded = part.added;
        const isRemoved = part.removed;
        let lines = part.value.replace(/\n$/, '').split('\n');

        // Accumulate consecutive added or removed parts
        while (
          i + 1 < diff.length &&
          diff[i + 1].added === isAdded &&
          diff[i + 1].removed === isRemoved
        ) {
          i++;
          const nextPart = diff[i];
          let nextLines = nextPart.value.replace(/\n$/, '').split('\n');
          lines = lines.concat(nextLines);
        }

        if (isAdded) {
          // Display added lines with a multi-line remove button
          displayLines.push(
            <Fragment key={`added-${lineNumber}`}>
              <div style={{ backgroundColor: 'lightgreen' }}>
                {lines.map((line, idx) => (
                  <div key={`added-line-${lineNumber + idx}`}>
                    <span className="text-gray-500">{lineNumber + idx}: </span>
                    {line}
                  </div>
                ))}
              </div>
              <RemoveLinesButton
                removeLines={removeLines}
                startLineNumber={lineNumber}
                numLines={lines.length}
              />
            </Fragment>
          );
          lineNumber += lines.length;
        } else if (isRemoved) {
          // Display removed lines with a multi-line add button
          displayLines.push(
            <Fragment key={`removed-${lineNumber}`}>
              <div style={{ backgroundColor: 'lightcoral' }}>
                {lines.map((line, idx) => (
                  <div key={`removed-line-${lineNumber + idx}`}>
                    <span className="text-gray-500">{lineNumber + idx}: </span>
                    {line}
                  </div>
                ))}
              </div>
              <AddLinesButton
                addLines={addLines}
                lineNumber={lineNumber}
                linesToAdd={lines}
              />
            </Fragment>
          );
          // Do not increment lineNumber for removed lines
        }
      } else {
        // Unchanged lines
        let lines = part.value.replace(/\n$/, '').split('\n');
        lines.forEach((line) => {
          displayLines.push(
            <div key={`unchanged-${lineNumber}`}>
              <span className="text-gray-500">{lineNumber}: </span>
              {line}
            </div>
          );
          lineNumber++;
        });
      }
      i++;
    }
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

  return (
    <div
      className="flex-grow flex-shrink flex-basis-0 bg-[#2f2f2f] flex flex-col h-full overflow-y-scroll text-black text-xs p-2 scrollbar-none"
      style={{ maxWidth: '750px' }}
    >
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
          <SyntaxHighlighter
            language="javascript"
            style={materialDark}
            className="scrollbar-none"
          >
            {selectedChatCode ? unescapeString(selectedChatCode) : ''}
          </SyntaxHighlighter>
        )}
        {!loading && activeTab === 'file' && selectedFileContent && (
          <SyntaxHighlighter
            language="javascript"
            style={materialDark}
            className="scrollbar-none"
          >
            {selectedFileContent}
          </SyntaxHighlighter>
        )}
        {!loading && activeTab === 'chat' && selectedChatCode && (
          <div className="h-full inline-block">
            <pre key={selectedChatCode} style={{ color: 'white' }}>
              {displayLines}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const AddLinesButton: React.FC<any> = ({ addLines, lineNumber, linesToAdd }) => {
  const numLines = linesToAdd.length;
  const buttonText = numLines > 1 ? `Add ${numLines} lines` : 'Add code';
  return (
    <button
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => addLines(linesToAdd, lineNumber)}
    >
      {buttonText}
    </button>
  );
};

const RemoveLinesButton: React.FC<any> = ({ removeLines, startLineNumber, numLines }) => {
  const buttonText =
    numLines > 1 ? `Remove ${numLines} lines` : `Remove code ${startLineNumber}`;
  return (
    <button
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => removeLines(startLineNumber, numLines)}
    >
      {buttonText}
    </button>
  );
};

export default FileViewer;
