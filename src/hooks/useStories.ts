import { useAppSelector, useAppDispatch } from './';
import { storiesActions, storiesSelectors } from '~/store/slices/storiesSlice';
import { useCallback } from 'react';

/**
 * Хук для работы со сказками через Redux
 */
export const useStories = () => {
  const dispatch = useAppDispatch();
  const stories = useAppSelector(storiesSelectors.selectStories);
  const currentStory = useAppSelector(storiesSelectors.selectCurrentStory);
  const filters = useAppSelector(storiesSelectors.selectFilters);
  const searchQuery = useAppSelector(storiesSelectors.selectSearchQuery);
  const loading = useAppSelector(storiesSelectors.selectLoading);
  const error = useAppSelector(storiesSelectors.selectError);
  const filteredStories = useAppSelector(storiesSelectors.selectFilteredStories);

  const setStories = useCallback((newStories: typeof stories) => {
    dispatch(storiesActions.setStories(newStories));
  }, [dispatch]);

  const setCurrentStory = useCallback((newStory: typeof currentStory) => {
    dispatch(storiesActions.setCurrentStory(newStory));
  }, [dispatch]);

  const setFilters = useCallback((newFilters: typeof filters) => {
    dispatch(storiesActions.setFilters(newFilters));
  }, [dispatch]);

  const setSearchQuery = useCallback((query: string) => {
    dispatch(storiesActions.setSearchQuery(query));
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch(storiesActions.setLoading(loading));
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch(storiesActions.setError(error));
  }, [dispatch]);

  const addStory = useCallback((story: typeof stories[0]) => {
    dispatch(storiesActions.addStory(story));
  }, [dispatch]);

  const updateStory = useCallback((story: typeof stories[0]) => {
    dispatch(storiesActions.updateStory(story));
  }, [dispatch]);

  const removeStory = useCallback((storyId: string) => {
    dispatch(storiesActions.removeStory(storyId));
  }, [dispatch]);

  const clearStories = useCallback(() => {
    dispatch(storiesActions.clearStories());
  }, [dispatch]);

  return {
    // State
    stories,
    currentStory,
    filters,
    searchQuery,
    loading,
    error,
    filteredStories,
    
    // Actions
    setStories,
    setCurrentStory,
    setFilters,
    setSearchQuery,
    setLoading,
    setError,
    addStory,
    updateStory,
    removeStory,
    clearStories,
  };
};
