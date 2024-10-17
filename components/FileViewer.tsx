import { unescapeString } from '@/app/utils';
import { RootState } from '@/store';
import { diffLines } from 'diff';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

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
  setSelectedChatCode
}) => {
  console.log(selectedFileContent);

  console.log(selectedChatCode);
  const loading = useSelector((state: RootState) => state.Messages.loading);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  let linesOfSelectedChatCode: any[] = [];
  const linesOfSelectedFileContent = selectedFileContent.split('\n');
  let displayLines: any = [];  
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
    const removeLine = (lineNumber: number, line: string) => {
      const newCode = linesOfSelectedChatCode.filter((_, index) => index !== lineNumber - 1);
      setSelectedChatCode(newCode.join('\n'));      
    }

    const combinedLines = [...untouchedLines, ...addedLines].sort((a, b) => a.lineNumber - b.lineNumber);

    displayLines = combinedLines.map(({ lineNumber, line }) => (
      <Fragment key={lineNumber}>
        <div style={{ backgroundColor: addedLines.some(added => added.lineNumber === lineNumber) ? 'lightgreen' : 'transparent' }}>
          <span className="text-gray-500">{lineNumber}: </span>
          {line}
        </div>
        {addedLines.some(added => added.lineNumber === lineNumber) && (
          <RemoveButton removeLine={removeLine} line={line} lineNumber={lineNumber} />
        )}
      </Fragment>
    ));
    
    console.log('Removed Lines: ', removedLines);
    console.log('Untouched Lines: ', untouchedLines);
    console.log('Added Lines: ', addedLines);
  }

  const diff = diffLines(selectedFileContent, selectedChatCode ? selectedChatCode : '');

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
    <div className="w-1/2 bg-blue-200 flex flex-col h-full overflow-y-scroll text-black text-xs p-2">
      <div className="flex bg-gray-100 p-2">
        <button
          className={`flex-1 text-center p-2 ${activeTab === 'file' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('file')}
          disabled={loading}
        >
          File
        </button>
        <button
          className={`flex-1 text-center p-2 ${activeTab === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('chat')}
          disabled={loading}
        >
          Chat
        </button>
      </div>
      {activeTab === 'chat' && !loading && (
        <button
          className="bg-blue-500 text-white p-2"
          onClick={handleReplaceCode}
        >
          Replace code in {selectedFileName}
        </button>
      )}
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <div className="w-full bg-blue-200 h-full overflow-y-scroll text-black text-xs p-2">
        {loading && <div>
          <pre>
            {selectedChatCode ? unescapeString(selectedChatCode) : ''}
          </pre>
        </div>}
        {!loading && activeTab === 'file' && selectedFileContent && (
          <div>
            <pre>
              {selectedFileContent.split('\n').map((line, index) => (
                <div key={index}>
                  <span className="text-gray-500">{index + 1}: </span>
                  {line}
                </div>
              ))}
            </pre>
          </div>
        )}
        {!loading && activeTab === 'chat' && selectedChatCode && (
          <div className='h-full inline-block'>
            <pre key={selectedChatCode}>
              {displayLines}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const AddButton: React.FC<any> = ({ lineNumber, value, file, updateFile }) => {
  return <button
    key={lineNumber}
    className="bg-blue-500 text-white p-2"
    onClick={() => addLine(value, lineNumber, file, updateFile)}>
    Add code {lineNumber}
  </button>
}

const RemoveButton: React.FC<any> = ({line, lineNumber, removeLine}) => {
  return <button
    key={lineNumber}
    className="bg-blue-500 text-white p-2"
    onClick={() => removeLine(lineNumber, line)}>
    Remove code {lineNumber}
  </button>
}

const addLine = (lineToAdd: string, lineNumber: number, file: string, updateFile: any) => {
  const newCode = file.split('\n').filter((line, index, arr) => index < arr.length - 1);
  newCode.splice(lineNumber, 0, lineToAdd);
  updateFile(newCode.join('\n'));
}
export default FileViewer;
