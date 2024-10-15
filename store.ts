import { configureStore } from '@reduxjs/toolkit';
import MessagesSlice from './slices/MessagesSlice';

const store = configureStore({
  reducer: {
    Messages: MessagesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
