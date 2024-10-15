import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
  type: 'text';
}

interface MessagesState {
  messages: Message[];
  loading: boolean;
}

const initialState: MessagesState = {
  messages: [
    { 
      content: `You are a software engineer bot that mostly produces coding answers. Each time you talked to, if the code might have a coding solution, you shall 
      answer with the JSON object {"answer": your textual answer as a chat bot, "files": [{fileName: name, code:code},{fileName2: name, code:code2} ] THE ENTIRE RESPONSE MUST BE JSON.
      the code snippet that you think is the answer}. You are allowed to create new files if necessary.
      If you return a code file, you return the same file name as the original file name exactly and EXACTLY the same code as the original code (apart from the changes you made). 
      If the code is not a coding solution, simply do not include the property in the JSON object.`,
      role: 'system',
      type: 'text',
    },
  ],
  loading: false,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
  },
});

export const { addMessage, setLoading, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
