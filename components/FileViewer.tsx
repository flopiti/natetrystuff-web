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

  const removeBlock = (startLine: number, blockLength: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = lines.filter((_, index) => index < startLine - 1 || index >= startLine - 1 + blockLength);
    setSelectedChatCode(newCode.join('\n'));
  };

  const addBlock = (block: string[], startLine: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = [
      ...lines.slice(0, startLine - 1),
      ...block,
      ...lines.slice(startLine - 1),
    ];
    setSelectedChatCode(newCode.join('\n'));
  };

  let displayLines: any[] = [];

  if (selectedChatCode) {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    let lineNumber = 1;

    for (let i = 0; i < diff.length; i++) {
      const part = diff[i];
      const lines = part.value.split('\n');
      const length = lines.length;

      if (part.added) {
        displayLines.push(
          <Fragment key={`added-block-${i}`}>
            <div style={{ backgroundColor: 'lightgreen' }}>
              {lines.map((line, index) => (
                <div key={`added-line-${lineNumber + index}`}>
                  <span className="text-gray-500">{lineNumber + index}: </span>
                  {line}
                </div>
              ))}
            </div>
            <RemoveButton removeLine={removeBlock} lineNumber={lineNumber} blockLength={length - 1} />
          </Fragment>
        );
        lineNumber += length - 1;
      } else if (part.removed) {
        displayLines.push(
          <Fragment key={`removed-block-${i}`}>
            <div style={{ backgroundColor: 'lightcoral' }}>
              {lines.map((line, index) => (
                <div key={`removed-line-${lineNumber + index}`}>
                  <span className="text-gray-500">{lineNumber + index}: </span>
                  {line}
                </div>
              ))}
            </div>
            <AddButton lineNumber={lineNumber} block={lines.slice(0, length - 1)} addLine={addBlock} />
          </Fragment>
        );
      } else {
        displayLines.push(
          <div key={`unchanged-${lineNumber}`}>
            <span className="text-gray-500">{lineNumber}: </span>
            {part.value.trim()}
          </div>
        );
        lineNumber += length - 1;
      }
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
            <SyntaxHighlighter language="javascript" style={materialDark} className='scrollbar-none'>
              {selectedChatCode ? unescapeString(selectedChatCode) : ''}
            </SyntaxHighlighter>
        )}
        {!loading && activeTab === 'file' && selectedFileContent && (
            <SyntaxHighlighter language="javascript" style={materialDark} className='scrollbar-none'>
              {selectedFileContent}
            </SyntaxHighlighter>            
        )}
        {!loading && activeTab === 'chat' && selectedChatCode && (
          <pre key={selectedChatCode} style={{ color: 'white', margin: 0, whiteSpace: 'pre-wrap' }}>
            {displayLines}
          </pre>
        )}
      </div>
    </div>
  );
};

const AddButton: React.FC<any> = ({ lineNumber, block, addLine }) => {
  return (
    <button
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => addLine(block, lineNumber)}
    >
      Add block
    </button>
  );
};

const RemoveButton: React.FC<any> = ({ lineNumber, blockLength, removeLine }) => {
  return (
    <button
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => removeLine(lineNumber, blockLength)}
    >
      Remove block starting at {lineNumber}
    </button>
  );
};

export default FileViewer;
