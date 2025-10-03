import { Story, CreateStoryData, UpdateStoryData, StoryFilters, PaginationOptions, PaginatedStoriesResponse } from '~/types';

export interface IStoriesService {

  getStories(filters?: StoryFilters): Promise<Story[]>;

  getStoriesPaginated(filters?: StoryFilters, pagination?: PaginationOptions): Promise<PaginatedStoriesResponse>;

  getStoryById(id: string): Promise<Story | null>;

  createStory(data: CreateStoryData): Promise<Story>;

  updateStory(id: string, data: UpdateStoryData): Promise<Story>;

  deleteStory(id: string): Promise<void>;

  getUserStories(userId: string): Promise<Story[]>;

  searchStories(query: string): Promise<Story[]>;
}
