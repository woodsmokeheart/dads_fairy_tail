// Базовые типы для приложения "Папины сказки"

export interface AuthUser {
  id: string;
  email: string;
  is_moderator?: boolean;
  user_metadata: {
    username?: string;
    avatar_url?: string;
    created_at?: string;
    stats?: {
      stories_created: number;
      stories_published: number;
    };
  };
}

export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  is_moderator?: boolean;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  content: string; // JSON строка от Tiptap
  content_text: string; // Чистый текст для поиска
  cover_image_url?: string;
  author_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author?: User;
}


export interface CreateStoryData {
  title: string;
  content: string;
  cover_image?: File;
  is_published?: boolean;
}

export interface UpdateStoryData extends Partial<CreateStoryData> {
  id: string;
}

// Типы для Tiptap редактора
export interface EditorContent {
  type: string;
  content?: EditorContent[];
  text?: string;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  attrs?: Record<string, unknown>;
}

// Типы для API ответов
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Типы для фильтров и поиска
export interface StoryFilters {
  author_id?: string;
  search?: string;
  is_published?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: 'created_at' | 'title' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'title' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedStoriesResponse {
  stories: Story[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StoryFormData {
  title: string;
  content: string;
  cover_image?: File;
  is_published: boolean;
}

export interface WebSocketMessage {
  type: 'new_story' | 'story_updated' | 'story_deleted' | 'user_joined';
  data: Record<string, unknown>;
  timestamp: string;
}

export interface StoryStats {
  total_stories: number;
  published_stories: number;
}

export interface UserStats {
  stories_created: number;
  stories_published: number;
}
