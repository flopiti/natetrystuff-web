export const askChatNoStream = async (messages: any[]): Promise<any> => {
    const response = await fetch('/api/chat-no-stream', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages })
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error('Error calling chat-no-stream:', response.statusText);
    }
};