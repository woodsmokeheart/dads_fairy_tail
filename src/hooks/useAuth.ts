import { useAppSelector, useAppDispatch } from './';
import { authActions, authSelectors } from '~/store/slices/authSlice';
import { useCallback } from 'react';


export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(authSelectors.selectUser);
  const loading = useAppSelector(authSelectors.selectLoading);
  const error = useAppSelector(authSelectors.selectError);
  const isAuthenticated = useAppSelector(authSelectors.selectIsAuthenticated);

  const setUser = useCallback((newUser: typeof user) => {
    dispatch(authActions.setUser(newUser));
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch(authActions.setLoading(loading));
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch(authActions.setError(error));
  }, [dispatch]);

  const clearAuth = useCallback(() => {
    dispatch(authActions.clearAuth());
  }, [dispatch]);

  return {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    setUser,
    setLoading,
    setError,
    clearAuth,
  };
};
