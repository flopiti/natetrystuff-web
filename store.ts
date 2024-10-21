//DESC: This file sets up the Redux store with message and project slices for state management.
import { configureStore } from '@reduxjs/toolkit';
import MessagesSlice from './slices/MessagesSlice';
import ProjectSlice from './slices/ProjectSlice';

const store = configureStore({
  reducer: {
    Messages: MessagesSlice,
    Projects : ProjectSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
