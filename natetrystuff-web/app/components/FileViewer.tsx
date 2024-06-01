import { diffLines } from 'diff';
import React from 'react';

interface FileViewerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFileContent: string;
  selectedChatCode: string;
  selectedFileName: string;
  replaceCode: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  activeTab,
  setActiveTab,
  selectedFileContent,
  selectedChatCode,
  selectedFileName,
  replaceCode
}) => {
  const getHighlightedCode = () => {
    const diff = diffLines(selectedFileContent, selectedChatCode);
    return (
      <pre>{diff.map((part: any, index: number) => {
        const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
        return part.value.split('\n').map((line: string, lineIndex: number) => {
          return <div key={lineIndex} style={style}>{line}</div>;
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
        >
          File
        </button>
        <button
          className={`flex-1 text-center p-2 ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
      </div>
      <div className="w-full bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
        {activeTab === 'file' && selectedFileContent && (<div><pre>{selectedFileContent}</pre></div>)}
        {activeTab === 'chat' && selectedChatCode && (
          <div>{getHighlightedCode()}
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
