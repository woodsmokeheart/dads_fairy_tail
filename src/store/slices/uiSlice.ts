import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  isCreateStoryModalOpen: boolean;
  isAuthModalOpen: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  toast: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  } | null;
}

const initialState: UIState = {
  isCreateStoryModalOpen: false,
  isAuthModalOpen: false,
  sidebarOpen: false,
  theme: 'light',
  toast: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCreateStoryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateStoryModalOpen = action.payload;
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    showToast: (state, action: PayloadAction<{
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
    }>) => {
      state.toast = {
        ...action.payload,
        visible: true,
      };
    },
    hideToast: (state) => {
      if (state.toast) {
        state.toast.visible = false;
      }
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
  selectors: {
    selectCreateStoryModalOpen: (state: UIState) => state.isCreateStoryModalOpen,
    selectAuthModalOpen: (state: UIState) => state.isAuthModalOpen,
    selectSidebarOpen: (state: UIState) => state.sidebarOpen,
    selectTheme: (state: UIState) => state.theme,
    selectToast: (state: UIState) => state.toast,
  },
});

export const {
  actions: uiActions,
  reducer: uiReducer,
  selectors: uiSelectors,
} = uiSlice;
