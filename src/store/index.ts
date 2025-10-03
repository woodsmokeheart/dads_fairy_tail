import { configureStore } from '@reduxjs/toolkit';
import {
  storiesReducer,
  authReducer,
  uiReducer,
} from './slices';

export const store = configureStore({
  reducer: {
    stories: storiesReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
