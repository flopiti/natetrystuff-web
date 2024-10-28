//DESC: This file contains functions to generate branch names, interact with a chat API, and process feature descriptions.
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

export const askGptToFindWhichFiles = async (featbugDescription:string, 
  selectedProjectName:string, 
  handleNewHighlitghtedFiles: (files: string[]) => void,
  handleNewSelectedFile: (file: string) => void
) => {
  if (featbugDescription) {
      try {
          const response = await fetch(`/api/get-desc-comments?project=${selectedProjectName}`);
          const result = await response.json();
          const descComments = JSON.stringify(result.data);
          const message = `What are the file names we should look for to fix the current feature/problem described in: ${featbugDescription}, and here are the files with with additional comments: ${descComments}. Please make sure to return a JSON with the 'answer' field containing the file names in a array.`;
          const messages = [{ role: 'user', content: message }];
          const chatResponse = await askChatNoStream(messages);

          if (chatResponse.answer) {
              handleNewHighlitghtedFiles(chatResponse.answer);
              handleNewSelectedFile(chatResponse.answer[0]);
          }
          console.log('ChatGPT Response:', chatResponse);
      } catch (error) {
          console.error('Error fetching and asking ChatGPT:', error);
      }
  }
};
