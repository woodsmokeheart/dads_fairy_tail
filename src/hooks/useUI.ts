import { useAppSelector, useAppDispatch } from './';
import { uiActions, uiSelectors } from '~/store/slices/uiSlice';
import { useCallback } from 'react';


export const useUI = () => {
  const dispatch = useAppDispatch();
  const isCreateStoryModalOpen = useAppSelector(uiSelectors.selectCreateStoryModalOpen);
  const isAuthModalOpen = useAppSelector(uiSelectors.selectAuthModalOpen);
  const sidebarOpen = useAppSelector(uiSelectors.selectSidebarOpen);
  const theme = useAppSelector(uiSelectors.selectTheme);
  const toast = useAppSelector(uiSelectors.selectToast);

  const setCreateStoryModalOpen = useCallback((open: boolean) => {
    dispatch(uiActions.setCreateStoryModalOpen(open));
  }, [dispatch]);

  const setAuthModalOpen = useCallback((open: boolean) => {
    dispatch(uiActions.setAuthModalOpen(open));
  }, [dispatch]);

  const setSidebarOpen = useCallback((open: boolean) => {
    dispatch(uiActions.setSidebarOpen(open));
  }, [dispatch]);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    dispatch(uiActions.setTheme(theme));
  }, [dispatch]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    dispatch(uiActions.showToast({ message, type }));
  }, [dispatch]);

  const hideToast = useCallback(() => {
    dispatch(uiActions.hideToast());
  }, [dispatch]);

  const clearToast = useCallback(() => {
    dispatch(uiActions.clearToast());
  }, [dispatch]);

  return {
    // State
    isCreateStoryModalOpen,
    isAuthModalOpen,
    sidebarOpen,
    theme,
    toast,
    
    // Actions
    setCreateStoryModalOpen,
    setAuthModalOpen,
    setSidebarOpen,
    setTheme,
    showToast,
    hideToast,
    clearToast,
  };
};
