export const generateBranchName = async (
    changeDescription: string
  ): Promise<string> => {
    const initialMessage = {
      role: "user",
      content: `Please provide a git branch name that summarizes the following change description into a maximum of three words, using dashes instead of spaces: "${changeDescription}". The response must be in a JSON with the only field being branchName`,
    };
    try {
      const response = await askChatNoStream([initialMessage]);
      console.log("Branch Name Suggestion:", response);
      return response.branchName;
    } catch (error) {
      console.error("Error in generating branch name:", error);
      throw error;
    }
  };

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
        console.log('Response from chat-no-stream:', data);
        // Handle the response data accordingly
        return data;
        // If there are files, you can update the state to reflect them as well
    } else {
        console.error('Error calling chat-no-stream:', response.statusText);
    }
};
