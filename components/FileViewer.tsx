import { unescapeString } from '@/app/utils';
import { RootState } from '@/store';
import { diffLines } from 'diff';
import React, { useState } from 'react';
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
  const loading = useSelector((state: RootState) => state.Messages.loading);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const diff = diffLines(selectedFileContent, selectedChatCode ? selectedChatCode : '')


  console.log(selectedChatCode)
  console.log(selectedFileContent)
  console.log(diff)
  let lineNumber = 0;

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
          {
              selectedChatCode ? unescapeString(selectedChatCode) : ''
            }
          </pre>
        </div>
        }
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
            <pre>
              {diff.map((part, index) => {
                console.log(part.value)
                let lines = part.value.split('\n')
                if(!part.removed) {
                  lines = part.value.split('\n').filter(line => line.trim() !== '')
                }

                let isNewPart = true;
              
                console.log(lines)
                const x = <div key={index}>
                {
                  lines.map((line, lineIndex) => {
                    const style = part.added ? { backgroundColor: 'lightgreen' } : part.removed ? { backgroundColor: 'lightcoral' } : {};
                    const lineContent = <span className="h-[16px] w-full" style={style}>{
                      line.split('\n').filter(line => line.trim() !== '')
                      }
                      </span>
                    return (
                      <div key={lineIndex}  style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-gray-500">{lineNumber + lineIndex + 1}: </span>
                        {lineContent}
                      </div>
                    );
                  }
                )}
                {
                   part.removed ? (
                    <AddButton
                      lineNumber={lineNumber}
                      value={part.value}
                      file={selectedChatCode}
                      updateFile={setSelectedChatCode}
                    />
                  ) : part.added ? (
                    <RemoveButton
                      lineNumber={lineNumber}
                      number={part.count ? part.count : 0}
                      file={selectedChatCode}
                      updateFile={setSelectedChatCode}
                    />
                  ) : null
                }
                </div>  
                if(!part.removed) { 
                lineNumber += part.count ? part.count : 0;
                }
                return x;
            })}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const AddButton: React.FC<any> = ({ lineNumber, value, file, updateFile }) => {

  console.log(value)
  return <button
    key={lineNumber}
    className="bg-blue-500 text-white p-2"
    onClick={() => addLine(value, lineNumber, file, updateFile)}>
    Add code { lineNumber}
  </button>
}

const RemoveButton: React.FC<any> = ({ lineNumber, number, file, updateFile}) => {
  return <button
    key={lineNumber}
    className="bg-blue-500 text-white p-2"
    onClick={() => removeLine(lineNumber, number,  file, updateFile)}>
    Remove code { lineNumber}
  </button>
}

const addLine = (lineToAdd: string, lineNumber: number, file:string, updateFile:any) => {
  const newCode = file.split('\n').filter((line, index, arr) => index < arr.length - 1);
  newCode.splice(lineNumber +1, 0, lineToAdd);
  updateFile(newCode.join('\n'));
};

const removeLine = (lineToRemove: number,length:number, file:string, updateFile:any) => {
  const newCode = file.split('\n');
  console.log(lineToRemove)
  newCode.splice(lineToRemove, length);
  updateFile(newCode.join('\n'));
};

export default FileViewer;
