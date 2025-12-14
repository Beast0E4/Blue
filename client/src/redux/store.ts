import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './slices/auth.slice';
import chatSliceReducer from './slices/chat.slice'

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    chat: chatSliceReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
