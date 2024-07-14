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
  
  const [originalContentByLine, setOriginalContentByLine] = useState(selectedFileContent.split('\n'));
  const revertLine = (lineNumber: number) => {
    console.log('reverting line', lineNumber)
    console.log(originalContentByLine)
    const updatedCodeLines = selectedChatCode.split('\n');
    updatedCodeLines[lineNumber] = originalContentByLine[lineNumber];
    setSelectedChatCode(updatedCodeLines.join('\n'));
  };

  const getHighlightedCode = () => {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    let lineNumber = 0;

    return (
      <pre>{diff.map((part, index) => {
        return part.value.split('\n').slice(0, -1).map((line, lineIndex) => {
          const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
          const lineContent = <span key={lineIndex} style={style}>{line}</span>;
          const revertButton = part.added ? (
            <button onClick={() => revertLine(lineNumber)}>Revert</button>
          ) : null;
          lineNumber += 1;
          return (
            <div key={lineIndex} style={{ display: 'flex', justifyContent: 'space-between' }}>
              {lineContent}
              {revertButton}
            </div>
          );
        });
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
