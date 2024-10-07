import { useState, useEffect } from 'react';

interface ConversationMessage {
    content: string;
    role: string;
    type: string;
}

const useConversation = (initialPrompt: string) => {
    const [conversation, setConversation] = useState<ConversationMessage[]>([
        { content: initialPrompt, role: 'system', type: 'text' }
    ]);
    const [loading, setLoading] = useState<boolean>(false);
    const [highlightedFiles, setHighlightedFiles] = useState<string[]>([]);
    const [highlightedFilesContent, setHighlightedFilesContent] = useState<any[]>([]);
    const [chatCodes, setChatCodes] = useState<any[]>([]);

    useEffect(() => {
        const lastMessage = conversation[conversation.length - 1];
        if (lastMessage.role === 'user') {
            setLoading(true);
            // Assuming askChat is a function that handles the conversation
            askChat(conversation, highlightedFiles, highlightedFilesContent);
        }
    }, [conversation, highlightedFiles, highlightedFilesContent]);

    const addToConversation = (message: string) => {
        setConversation([...conversation, { content: message, role: 'user', type: 'text' }]);
    };

    return {
        conversation,
        loading,
        addToConversation,
        setHighlightedFiles,
        setHighlightedFilesContent,
        chatCodes,
        setChatCodes
    };
};

export default useConversation;
