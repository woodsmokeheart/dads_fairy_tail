import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser } from '~/types';

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    },
  },
  selectors: {
    selectUser: (state: AuthState) => state.user,
    selectLoading: (state: AuthState) => state.loading,
    selectError: (state: AuthState) => state.error,
    selectIsAuthenticated: (state: AuthState) => !!state.user,
  },
});

export const {
  actions: authActions,
  reducer: authReducer,
  selectors: authSelectors,
} = authSlice;
