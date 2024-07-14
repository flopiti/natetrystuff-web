import { diffLines } from 'diff';
import React, { useState } from 'react';

interface FileViewerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFileContent: string;
  selectedChatCode: string;
  selectedFileName: string;
  replaceCode: () => void;
  loading: boolean;
  splitFileData : string;
  setSelectedChatCode: (code: string) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  activeTab,
  setActiveTab,
  selectedFileContent,
  selectedChatCode,
  selectedFileName,
  replaceCode,
  loading,
  setSelectedChatCode
}) => {

  const splitStringByNewLine = (str: string) => {
    return str.split('\n');
  }

  const removeLine = (lineToRemove: number) => {
    console.log('removing line', lineToRemove)
    console.log(selectedChatCode.toString())
    const splitSelected = splitStringByNewLine(selectedChatCode.toString());
    const newCode = splitSelected.filter((line, index) => index !== lineToRemove - 1).join('\n');
    setSelectedChatCode(newCode);
  };

  const addLine = (lineToAdd: string, lineNumber: number) => {
    const lines = selectedChatCode.split('\n');
    lines.splice(lineNumber - 1, 0, lineToAdd);
    return lines.join('\n');
  }
  
  const revertLine = (lineNumber: number, diff:any) => {
    const newCode = removeLine(lineNumber);
    console.log('newCode', newCode)

  };

  const getHighlightedCode = () => {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    let lineNumber = 0;
    console.log(diff)
    return (
      <pre>{diff.map((part, index) => {
        const lines = part.value.split('\n').slice(0, -1);
        const lineElements = lines.map((line, lineIndex) => {
          const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
          const lineContent = <span key={lineIndex} style={style}>{line}</span>;
          const revertButton = part.added ? (
            <button onClick={(function(currentLineNumber) {
                return () => removeLine(currentLineNumber);
              })(lineNumber)}>Revert</button>
          ) : null;
          return (
            <div key={lineIndex} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {lineContent}
              {revertButton}
            </div>
          );
        });
        lineNumber += lines.length; // Increment lineNumber by the number of actual lines processed
        return lineElements;
      })}</pre>
    );
  };

  return (
    <div className="w-1/2 bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
      <div className="flex bg-gray-100 p-2">
        <button
          className={`flex-1 text-center p-2 ${activeTab === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('file')}
          disabled={loading} // Disable button when loading
        >
          File
        </button>
        <button
          className={`flex-1 text-center p-2 ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('chat')}
          disabled={loading} // Disable button when loading
        >
          Chat
        </button>
      </div>
      <div className="w-full bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
        {loading && <p className="text-center text-black">Loading...</p>} {/* Show loading message */}
        {!loading && activeTab === 'file' && selectedFileContent && (<div><pre>{selectedFileContent}</pre></div>)}
        {!loading && activeTab === 'chat' && selectedChatCode && (
          <div>
            {getHighlightedCode()}
            <button
              className="bg-blue-500 text-white p-2"
              onClick={() => replaceCode()}
            >
              Replace code in {selectedFileName}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileViewer;
