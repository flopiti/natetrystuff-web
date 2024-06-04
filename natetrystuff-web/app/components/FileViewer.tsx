import React, { useEffect, useState } from 'react';

const FileViewer = ({ selectedFileContent, splitFileData, ...props }: any) => {
    const [parsedSplitFileData, setParsedSplitFileData] = useState<any>(null);

    useEffect(() => {
        if (splitFileData) {
            setParsedSplitFileData(splitFileData);
            const content = JSON.parse(splitFileData.content);
            console.log(content);

        }
    }, [splitFileData]);

    return (
        <div className="flex-grow w-[60%] overflow-scroll">
            <h1>File Viewer</h1>
            <pre>{selectedFileContent}</pre>
            {parsedSplitFileData && (
                <div>
                    <h2>Split File Data</h2>
                    <pre>{JSON.stringify(parsedSplitFileData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default FileViewer;
