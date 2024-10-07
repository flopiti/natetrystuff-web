import { useState } from "react";

export const useConversation = () => {

    const PROMPT = `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
    answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] THE ENTIRE RESPONSE MUST BE JSON.
    the code snippet that you think is the answer}. You are allowed to create new files if necessary.
    If you return a code file, you return the same file name as the original file name exactly and EXACTLY the same code as the original code (apart from the changes you made). 
    If the code is not a coding solution, simply do not include the property in the JSON object.`;

    const [conversation, setConversation] = useState<{ content: string, role: string, type: string }[]>([{ content: PROMPT, role: 'system', type: 'text' }])
    const [chatCodes, setChatCodes] = useState<any[]>([]);
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [selectedChatCode, setSelectedChatCode] = useState<string>('');

    return {
        conversation,
        setConversation,
        chatCodes,
        setChatCodes,
        highlightedFiles,
        setHighlightedFiles,
        highlightedFilesContent,
        setHighlightedFilesContent,
        selectedChatCode,
        setSelectedChatCode
    }
}

