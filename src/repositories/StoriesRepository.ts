import { supabase } from '~/lib/supabase';
import { IStoriesRepository, ILogger } from '~/interfaces';
import { Story, CreateStoryData, UpdateStoryData, StoryFilters, PaginationOptions, PaginatedStoriesResponse } from '~/types';
import { ExecutionQueue } from '~/libs/async';
import { inject } from '~/libs/di';
import { IFileUploadService } from '~/services/FileUploadService';


export class StoriesRepository implements IStoriesRepository {
  private static _instance?: IStoriesRepository;

  static getInstance(
    executionQueue = inject('executionQueue'),
    logger = inject('logger'),
    fileUploadService = inject('fileUploadService'),
  ): IStoriesRepository {
    if (!StoriesRepository._instance) {
      StoriesRepository._instance = new StoriesRepository(executionQueue, logger, fileUploadService);
    }
    return StoriesRepository._instance;
  }

  constructor(
    private readonly _executionQueue: ExecutionQueue,
    private readonly _logger: ILogger,
    private readonly _fileUploadService: IFileUploadService,
  ) {}

  private _extractTextFromJSON(content: unknown): string {
    if (!content || typeof content !== 'object') {
      return '';
    }

    const contentObj = content as Record<string, unknown>;

    if (contentObj.type === 'text' && typeof contentObj.text === 'string') {
      return contentObj.text;
    }

    if (contentObj.content && Array.isArray(contentObj.content)) {
      return contentObj.content
        .map((item: unknown) => this._extractTextFromJSON(item))
        .join('')
        .trim();
    }

    return '';
  }

  async getStories(filters?: StoryFilters): Promise<Story[]> {
    try {
      const { data, error } = await this._executionQueue.run({
        key: ['stories', 'list', JSON.stringify(filters)],
        fn: async () => {
          let query = supabase
            .from('stories')
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .order('created_at', { ascending: false });


          if (filters?.author_id) {
            query = query.eq('author_id', filters.author_id);
          }

          if (filters?.search) {
            query = query.textSearch('title', filters.search);
          }

          return query;
        },
      });

      if (error) {
        throw error;
      }

      return data?.map(story => ({
        ...story,
        cover_image_url: story.cover_image_url || undefined,
        author: story.profiles ? {
          id: story.profiles.id,
          username: story.profiles.username,
          avatar_url: story.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      })) || [];
    } catch (err) {
      this._logger.error('[StoriesRepository] getStories error:', err);
      throw err;
    }
  }

  async getStoriesPaginated(
    filters?: StoryFilters, 
    pagination?: PaginationOptions
  ): Promise<PaginatedStoriesResponse> {
    try {
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 6;
      const sortBy = pagination?.sortBy || 'created_at';
      const sortOrder = pagination?.sortOrder || 'desc';
      
      const start = (page - 1) * limit;
      const end = start + limit - 1;

      this._logger.debug('[StoriesRepository] getStoriesPaginated:', { 
        filters, 
        page, 
        limit, 
        start, 
        end 
      });

      const { data, error, count } = await this._executionQueue.run({
        key: ['stories', 'paginated', JSON.stringify({ filters, pagination })],
        fn: async () => {
          let query = supabase
            .from('stories')
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `, { count: 'exact' });

          if (filters?.author_id) {
            query = query.eq('author_id', filters.author_id);
          }

          if (filters?.is_published !== undefined) {
            query = query.eq('is_published', filters.is_published);
          }

          if (filters?.search) {
            query = query.textSearch('title', filters.search);
          }

          return query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(start, end);
        },
      });

      if (error) {
        throw error;
      }

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      const stories = data?.map(story => ({
        ...story,
        cover_image_url: story.cover_image_url || undefined,
        author: story.profiles ? {
          id: story.profiles.id,
          username: story.profiles.username,
          avatar_url: story.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      })) || [];

      return {
        stories,
        totalCount,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    } catch (err) {
      this._logger.error('[StoriesRepository] getStoriesPaginated error:', err);
      throw err;
    }
  }

  async getStoryById(id: string): Promise<Story | null> {
    try {
      const { data, error } = await this._executionQueue.run({
        key: ['stories', 'by_id', id],
        fn: async () => {
          return supabase
            .from('stories')
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .eq('id', id)
            .single();
        },
      });

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data ? {
        ...data,
        cover_image_url: data.cover_image_url || undefined,
        author: data.profiles ? {
          id: data.profiles.id,
          username: data.profiles.username,
          avatar_url: data.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      } : null;
    } catch (err) {
      this._logger.error('[StoriesRepository] getStoryById error:', err);
      throw err;
    }
  }

  async createStory(data: CreateStoryData): Promise<Story> {
    try {
      const { data: result, error } = await this._executionQueue.run({
        key: ['stories', 'create', Date.now().toString()],
        fn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('Пользователь не авторизован');
          }

          let contentText = '';
          try {
            const parsedContent = JSON.parse(data.content);
            contentText = this._extractTextFromJSON(parsedContent);
          } catch {
            contentText = data.content.replace(/<[^>]*>/g, '').trim();
          }

          let coverImageUrl: string | undefined = undefined;
          if (data.cover_image) {
            this._logger.debug('[StoriesRepository] Uploading cover image...');
            coverImageUrl = await this._fileUploadService.uploadImage(data.cover_image, 'covers');
            this._logger.debug('[StoriesRepository] Cover image uploaded:', coverImageUrl);
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { cover_image: _, ...storyData } = data;
          
          return supabase
            .from('stories')
            .insert({
              ...storyData,
              author_id: user.id,
              content_text: contentText,
              cover_image_url: coverImageUrl,
            })
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .single();
        },
      });

      if (error) {
        throw error;
      }

      return {
        ...result,
        cover_image_url: result.cover_image_url || undefined,
        author: result.profiles ? {
          id: result.profiles.id,
          username: result.profiles.username,
          avatar_url: result.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      };
    } catch (err) {
      this._logger.error('[StoriesRepository] createStory error:', err);
      throw err;
    }
  }

  async updateStory(id: string, data: UpdateStoryData): Promise<Story> {
    try {
      const { data: result, error } = await this._executionQueue.run({
        key: ['stories', 'update', id],
        fn: async () => {
          const { cover_image: coverImageFile, ...storyData } = data;
          const updateData: Record<string, unknown> = { ...storyData };
          
          if (data.content) {
            let contentText = '';
            try {
              const parsedContent = JSON.parse(data.content);
              contentText = this._extractTextFromJSON(parsedContent);
            } catch {
              contentText = data.content.replace(/<[^>]*>/g, '').trim();
            }
            updateData.content_text = contentText;
          }

          if (coverImageFile) {
            this._logger.debug('[StoriesRepository] Uploading new cover image...');
            const coverImageUrl = await this._fileUploadService.uploadImage(coverImageFile, 'covers');
            this._logger.debug('[StoriesRepository] New cover image uploaded:', coverImageUrl);
            updateData.cover_image_url = coverImageUrl;
          }

          return supabase
            .from('stories')
            .update(updateData)
            .eq('id', id)
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .single();
        },
      });

      if (error) {
        throw error;
      }

      return {
        ...result,
        cover_image_url: result.cover_image_url || undefined,
        author: result.profiles ? {
          id: result.profiles.id,
          username: result.profiles.username,
          avatar_url: result.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      };
    } catch (err) {
      this._logger.error('[StoriesRepository] updateStory error:', err);
      throw err;
    }
  }

  async deleteStory(id: string): Promise<void> {
    try {
      const { error } = await this._executionQueue.run({
        key: ['stories', 'delete', id],
        fn: async () => {
          return supabase
            .from('stories')
            .delete()
            .eq('id', id);
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      this._logger.error('[StoriesRepository] deleteStory error:', err);
      throw err;
    }
  }

  async getUserStories(userId: string): Promise<Story[]> {
    try {
      const { data, error } = await this._executionQueue.run({
        key: ['stories', 'user', userId],
        fn: async () => {
          return supabase
            .from('stories')
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .eq('author_id', userId)
            .order('created_at', { ascending: false });
        },
      });

      if (error) {
        throw error;
      }

      return data?.map(story => ({
        ...story,
        cover_image_url: story.cover_image_url || undefined,
        author: story.profiles ? {
          id: story.profiles.id,
          username: story.profiles.username,
          avatar_url: story.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      })) || [];
    } catch (err) {
      this._logger.error('[StoriesRepository] getUserStories error:', err);
      throw err;
    }
  }

  async searchStories(query: string): Promise<Story[]> {
    try {
      const { data, error } = await this._executionQueue.run({
        key: ['stories', 'search', query],
        fn: async () => {
          return supabase
            .from('stories')
            .select(`
              *,
              profiles:author_id (
                id,
                username,
                avatar_url
              )
            `)
            .textSearch('title', query)
            .order('created_at', { ascending: false });
        },
      });

      if (error) {
        throw error;
      }

      return data?.map(story => ({
        ...story,
        cover_image_url: story.cover_image_url || undefined,
        author: story.profiles ? {
          id: story.profiles.id,
          username: story.profiles.username,
          avatar_url: story.profiles.avatar_url || undefined,
          is_moderator: false, // TODO: добавить is_moderator в profiles
          created_at: new Date().toISOString(), // TODO: добавить created_at в profiles
        } : undefined,
      })) || [];
    } catch (err) {
      this._logger.error('[StoriesRepository] searchStories error:', err);
      throw err;
    }
  }
}
