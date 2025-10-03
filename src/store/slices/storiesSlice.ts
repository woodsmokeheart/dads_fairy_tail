import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Story, StoryFilters } from '~/types';

export interface StoriesState {
  stories: Story[];
  currentStory: Story | null;
  filters: StoryFilters;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: StoriesState = {
  stories: [],
  currentStory: null,
  filters: {},
  loading: false,
  error: null,
  searchQuery: '',
};

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setStories: (state, action: PayloadAction<Story[]>) => {
      state.stories = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentStory: (state, action: PayloadAction<Story | null>) => {
      state.currentStory = action.payload;
    },
    setFilters: (state, action: PayloadAction<StoryFilters>) => {
      state.filters = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.unshift(action.payload);
    },
    updateStory: (state, action: PayloadAction<Story>) => {
      const index = state.stories.findIndex(story => story.id === action.payload.id);
      if (index !== -1) {
        state.stories[index] = action.payload;
      }
      if (state.currentStory?.id === action.payload.id) {
        state.currentStory = action.payload;
      }
    },
    removeStory: (state, action: PayloadAction<string>) => {
      state.stories = state.stories.filter(story => story.id !== action.payload);
      if (state.currentStory?.id === action.payload) {
        state.currentStory = null;
      }
    },
    clearStories: (state) => {
      state.stories = [];
      state.currentStory = null;
      state.error = null;
    },
  },
  selectors: {
    selectStories: (state: StoriesState) => state.stories,
    selectCurrentStory: (state: StoriesState) => state.currentStory,
    selectFilters: (state: StoriesState) => state.filters,
    selectSearchQuery: (state: StoriesState) => state.searchQuery,
    selectLoading: (state: StoriesState) => state.loading,
    selectError: (state: StoriesState) => state.error,
    selectFilteredStories: (state: StoriesState) => {
      let filtered = state.stories;
      
      
      if (state.filters.author_id) {
        filtered = filtered.filter(story => story.author_id === state.filters.author_id);
      }
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(story => 
          story.title.toLowerCase().includes(query) ||
          story.content.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    },
  },
});

export const {
  actions: storiesActions,
  reducer: storiesReducer,
  selectors: storiesSelectors,
} = storiesSlice;
