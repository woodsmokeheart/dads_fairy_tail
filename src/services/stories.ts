import { IStoriesService, IStoriesRepository, ILogger } from '~/interfaces';
import { Story, CreateStoryData, UpdateStoryData, StoryFilters, PaginationOptions, PaginatedStoriesResponse } from '~/types';
import { inject } from '~/libs/di';


export class StoriesService implements IStoriesService {
  private static _instance?: IStoriesService;

  static getInstance(
    storiesRepository = inject('storiesRepository'),
    logger = inject('logger'),
  ): IStoriesService {
    if (!StoriesService._instance) {
      StoriesService._instance = new StoriesService(storiesRepository, logger);
    }
    return StoriesService._instance;
  }

  constructor(
    private readonly _storiesRepository: IStoriesRepository,
    private readonly _logger: ILogger,
  ) {}

  async getStories(filters?: StoryFilters): Promise<Story[]> {
    try {
      this._logger.debug('[StoriesService] getStories called with filters:', filters);
      return await this._storiesRepository.getStories(filters);
    } catch (err) {
      this._logger.error('[StoriesService] getStories error:', err);
      throw err;
    }
  }

  async getStoriesPaginated(filters?: StoryFilters, pagination?: PaginationOptions): Promise<PaginatedStoriesResponse> {
    try {
      this._logger.debug('[StoriesService] getStoriesPaginated called with filters:', filters, 'pagination:', pagination);
      return await this._storiesRepository.getStoriesPaginated(filters, pagination);
    } catch (err) {
      this._logger.error('[StoriesService] getStoriesPaginated error:', err);
      throw err;
    }
  }

  async getStoryById(id: string): Promise<Story | null> {
    try {
      this._logger.debug('[StoriesService] getStoryById called with id:', id);
      return await this._storiesRepository.getStoryById(id);
    } catch (err) {
      this._logger.error('[StoriesService] getStoryById error:', err);
      throw err;
    }
  }

  async createStory(data: CreateStoryData): Promise<Story> {
    try {
      this._logger.debug('[StoriesService] createStory called with data:', data);
      
      if (!data.title.trim()) {
        throw new Error('Название сказки не может быть пустым');
      }
      
      if (!data.content.trim()) {
        throw new Error('Содержание сказки не может быть пустым');
      }

      return await this._storiesRepository.createStory(data);
    } catch (err) {
      this._logger.error('[StoriesService] createStory error:', err);
      throw err;
    }
  }

  async updateStory(id: string, data: UpdateStoryData): Promise<Story> {
    try {
      this._logger.debug('[StoriesService] updateStory called with id:', id, 'data:', data);
      
      if (data.title !== undefined && !data.title.trim()) {
        throw new Error('Название сказки не может быть пустым');
      }
      
      if (data.content !== undefined && !data.content.trim()) {
        throw new Error('Содержание сказки не может быть пустым');
      }

      return await this._storiesRepository.updateStory(id, data);
    } catch (err) {
      this._logger.error('[StoriesService] updateStory error:', err);
      throw err;
    }
  }

  async deleteStory(id: string): Promise<void> {
    try {
      this._logger.debug('[StoriesService] deleteStory called with id:', id);
      await this._storiesRepository.deleteStory(id);
    } catch (err) {
      this._logger.error('[StoriesService] deleteStory error:', err);
      throw err;
    }
  }

  async getUserStories(userId: string): Promise<Story[]> {
    try {
      this._logger.debug('[StoriesService] getUserStories called with userId:', userId);
      return await this._storiesRepository.getUserStories(userId);
    } catch (err) {
      this._logger.error('[StoriesService] getUserStories error:', err);
      throw err;
    }
  }

  async searchStories(query: string): Promise<Story[]> {
    try {
      this._logger.debug('[StoriesService] searchStories called with query:', query);
      
      if (!query.trim()) {
        return [];
      }

      return await this._storiesRepository.searchStories(query);
    } catch (err) {
      this._logger.error('[StoriesService] searchStories error:', err);
      throw err;
    }
  }
}