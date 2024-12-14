import { getTopLevelArrayElements, getTopLevelValues } from "@/app/utils";
import { ProjectFile } from "@/types/project";

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
      return response.branchName;
    } catch (error) {
      console.error("Error in generating branch name:", error);
      throw error;
    }
  };
export const askChat = async (
  conversation: any[],
  highlightedFiles: ProjectFile[],
  dispatchSetMessages: (messages: any[]) => void,
  setEdited: (editedFiles: ProjectFile[]) => void,
  dispatchSetLoading: (loading: boolean) => void,
) => {
  const messages = conversation.map((message: { role: any; content: any; }) => {
      return { role: message.role, content: message.content, type: 'text' };
  });
  const lastMessage = messages[messages.length - 1];
  messages.pop();
  const highlightedFilesText = highlightedFiles.map((highlightedFile) => `${highlightedFile.name}: ${highlightedFile.content}` )
  messages.push({ content: lastMessage.content + ` The code is: ${highlightedFilesText}`, role: 'user', type: 'text' });
  const response = await fetch('api/chat', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ messages })
  });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let chatCompletion = '';
  while (!done) {
      const { value, done: doneReading } = await reader?.read()!;
      done = doneReading;
      const chunk = decoder.decode(value, { stream: true });
      chatCompletion += chunk;            
      let buffer = '';
      try {
          const jsonStartIndex = chatCompletion.indexOf('{');                
          if (jsonStartIndex !== -1) {
              buffer += chatCompletion.substring(jsonStartIndex);
              const valueMatches = getTopLevelValues(buffer);
              if (valueMatches) {
                  valueMatches.forEach((value, index) => {
                      if(index + 1 === 1){
                          dispatchSetMessages([...conversation, { content: value, role: 'assistant', type: 'text' }]);
                      }
                      if(index + 1 === 2){
                          const files = getTopLevelArrayElements(value);
                          let arrayElementsValues = files.map((element) => {
                              return getTopLevelValues(element);
                          });
                          const newChatCodes = arrayElementsValues.map((element) => ({
                              name: element[0],
                              content: element[1] ? element[1].replace(/\n/g, '\n') : ''
                          }));
                          setEdited(newChatCodes);  
                      }
                  });
              }
          }
      } catch (error) {
          console.error('Error processing JSON chunk:', error);
      }
  }
  dispatchSetLoading(false);
  console.log('Finished Chat Completion:', JSON.parse(chatCompletion).files);
  setEdited(JSON.parse(chatCompletion).files);
  return  
}


export const chatCleanSentence = async (sentence: string) => {
  try {
      const response = await fetch('/api/chat-clean-sentence', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sentence })
      });
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error cleaning sentence:', error);
  }
}


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

export const askGptToFindWhichFiles = async (featbugDescription:string) => {
  if (featbugDescription) {
      try {
        return await queryFileForFeatBug(featbugDescription)

      } catch (error) {
          console.error('Error fetching and asking ChatGPT:', error);
      }
  }
};

export const askGptToFindWhichProject = async (projectsString: string, featbugDescription:string) => {
  try {
      const message = `Which project should we work on to execute the task: ${featbugDescription}. Here are the projects: ${projectsString}. Please return a JSON with the 'answer' field containing the project name in a array (Because yes, there can be more than a single project).`;
      const messages = [{ role: 'user', content: message }];
      const chatResponse = await askChatNoStream(messages);
      return chatResponse.answer;
  } catch (error) {
      console.error('Error fetching and asking ChatGPT:', error);
  }
}

export const embedFile = async (fileName: string, file:string, projectName: string) =>{
  await askChatNoStream([{ role: 'user', content: `
    Give me a structured explanation of what is happening in this file.
    Filename: ${fileName}, fileContent: ${file}, projectName: ${projectName}. Return in JSON only.
    The FIRST high level field MUST BE EXACLTY : filename : ${fileName}  
    ` }]).then( async data => {
        const jsonString = JSON.stringify(data, null, 2);
        const response = await fetch('/api/embed', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'no-store',
            body: JSON.stringify({id: `${projectName}/${fileName}`, projectName, toEmbed: jsonString, fileName:fileName })
        });
        return await response.json();
      }
);
}

export const queryFileForFeatBug = async (featBugDescrsiption:string) => {
try {
    const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify({ featbugDescription: featBugDescrsiption })
    });
    const result = await response.json();
    return result.matches[0].metadata.fileName;
} catch (error) {
    console.error('Error querying file for feature/bug description:', error);
}
 }

export const getAllNodes = async () => {
  console.log('DUDE WHY THE FUCK is this not reacing')
  try {
    const response = await fetch('/api/get-all-nodes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      },
      cache: 'no-store',

      
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Error fetching all nodes:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching all nodes:', error);
  }

  
};