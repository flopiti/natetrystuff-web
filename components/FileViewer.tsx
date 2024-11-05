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

  const removeLine = (lineNumber: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = lines.filter((_, index) => index !== lineNumber - 1);
    setSelectedChatCode(newCode.join('\n'));
  };

  const addLine = (line: string, lineNumber: number) => {
    const lines = selectedChatCode?.split('\n') || [];
    const newCode = [
      ...lines.slice(0, lineNumber - 1),
      line,
      ...lines.slice(lineNumber - 1),
    ];
    setSelectedChatCode(newCode.join('\n'));
  };

  let displayLines: any[] = [];

  if (selectedChatCode) {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    let lineNumber = 1;

    diff.forEach((part, index) => {
      const lines = part.value.split('\n');
      if (part.added || part.removed) {
        const block = [
          ...lines.map((line, i) => {
            if (line === '' && i === lines.length - 1) return null;
            return (
              <div key={`line-${lineNumber}-${index}`} style={{ backgroundColor: part.added ? 'lightgreen' : 'lightcoral' }}>
                <span className="text-gray-500">{lineNumber}: </span>
                {line}
              </div>
            );
          }),
        ];
        displayLines.push(
          <Fragment key={`block-${lineNumber}-${index}`}>
            {block}
            {part.added && <RemoveButton removeLine={removeLine} lineNumber={lineNumber} />}
            {part.removed && <AddButton lineNumber={lineNumber} line={lines.join('\n')} addLine={addLine} />}
          </Fragment>
        );
        lineNumber += lines.length - 1;
      } else {
        lines.forEach((line, i) => {
          if (line === '' && i === lines.length - 1) return; // Skip the last empty line
          displayLines.push(
            <div key={`unchanged-${lineNumber}`}>
              <span className="text-gray-500">{lineNumber}: </span>
              {line}
            </div>
          );
          lineNumber++;
        });
      }
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

const AddButton: React.FC<any> = ({ line, lineNumber, addLine }) => {
  return (
    <button
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => addLine(line, lineNumber)}
    >
      Add code
    </button>
  );
};

const RemoveButton: React.FC<any> = ({ lineNumber, removeLine }) => {
  return (
    <button
      key={lineNumber}
      className="bg-[#2f2f2f] text-white p-2"
      onClick={() => removeLine(lineNumber)}
    >
      Remove code {lineNumber}
    </button>
  );
};

export default FileViewer;
