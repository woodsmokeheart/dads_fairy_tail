# 🔌 API и сервисы

## Обзор архитектуры сервисов

Приложение построено на многоуровневой сервисной архитектуре с четким разделением ответственности.

```
┌──────────────────────────────────────┐
│         React Components             │
└──────────────────────────────────────┘
              ↓ inject()
┌──────────────────────────────────────┐
│        Services Layer                │
│  (Бизнес-логика и валидация)        │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│      Repositories Layer              │
│  (Доступ к данным и кеширование)    │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│     Supabase Client                  │
│  (PostgreSQL, Auth, Storage)        │
└──────────────────────────────────────┘
```

---

## 📚 StoriesService

Сервис для работы со сказками.

**Расположение**: `src/services/stories.ts`  
**Интерфейс**: `IStoriesService`

### Методы

#### `getStories(filters?: StoryFilters): Promise<Story[]>`

Получение списка сказок с фильтрацией.

**Параметры:**
```typescript
interface StoryFilters {
  author_id?: string;       // Фильтр по автору
  search?: string;          // Поиск по тексту
  is_published?: boolean;   // Только опубликованные
}
```

**Возвращает:**
```typescript
Story[] // Массив сказок
```

**Пример:**
```typescript
const storiesService = inject('storiesService');

// Все опубликованные сказки
const stories = await storiesService.getStories({ 
  is_published: true 
});

// Сказки конкретного автора
const authorStories = await storiesService.getStories({ 
  author_id: 'user-123' 
});
```

---

#### `getStoriesPaginated(filters?: StoryFilters, pagination?: PaginationOptions): Promise<PaginatedStoriesResponse>`

Получение сказок с пагинацией.

**Параметры:**
```typescript
interface PaginationOptions {
  page?: number;          // Номер страницы (default: 1)
  limit?: number;         // Сказок на странице (default: 10)
  sortBy?: 'created_at' | 'title' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
}
```

**Возвращает:**
```typescript
interface PaginatedStoriesResponse {
  stories: Story[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

**Пример:**
```typescript
// Первая страница с 6 сказками
const result = await storiesService.getStoriesPaginated(
  { is_published: true },
  { page: 1, limit: 6 }
);

console.log(`Страница ${result.currentPage} из ${result.totalPages}`);
console.log(`Всего сказок: ${result.totalCount}`);
```

---

#### `getStoryById(id: string): Promise<Story | null>`

Получение одной сказки по ID.

**Параметры:**
- `id: string` - UUID сказки

**Возвращает:**
- `Story` - если найдена
- `null` - если не найдена

**Пример:**
```typescript
const story = await storiesService.getStoryById('story-uuid');

if (story) {
  console.log(story.title);
} else {
  console.log('Сказка не найдена');
}
```

---

#### `createStory(data: CreateStoryData): Promise<Story>`

Создание новой сказки.

**Параметры:**
```typescript
interface CreateStoryData {
  title: string;           // Название (обязательно)
  content: string;         // JSON от Tiptap (обязательно)
  cover_image?: File;      // Файл обложки (опционально)
  is_published?: boolean;  // Статус публикации (default: true)
}
```

**Валидация:**
- Название не пустое
- Содержание не пустое
- Обложка: max 5MB, форматы JPG/PNG/WEBP

**Возвращает:**
```typescript
Story // Созданная сказка
```

**Ошибки:**
- `"Название сказки не может быть пустым"`
- `"Содержание сказки не может быть пустым"`
- `"Ошибка загрузки обложки"`

**Пример:**
```typescript
try {
  const newStory = await storiesService.createStory({
    title: 'Волшебный лес',
    content: JSON.stringify(tiptapContent),
    cover_image: coverFile,
    is_published: true
  });
  
  console.log('Сказка создана:', newStory.id);
} catch (error) {
  console.error('Ошибка:', error.message);
}
```

---

#### `updateStory(id: string, data: UpdateStoryData): Promise<Story>`

Обновление существующей сказки.

**Параметры:**
```typescript
interface UpdateStoryData {
  title?: string;
  content?: string;
  cover_image?: File;
  is_published?: boolean;
}
```

**Валидация:**
- Если title указан, он не должен быть пустым
- Если content указан, он не должен быть пустым

**Возвращает:**
```typescript
Story // Обновленная сказка
```

**Пример:**
```typescript
const updatedStory = await storiesService.updateStory('story-id', {
  title: 'Новое название',
  is_published: true
});
```

---

#### `deleteStory(id: string): Promise<void>`

Удаление сказки.

**Параметры:**
- `id: string` - UUID сказки

**Возвращает:**
- `void` (ничего)

**Ошибки:**
- Если сказка не найдена
- Если нет прав на удаление

**Пример:**
```typescript
await storiesService.deleteStory('story-id');
console.log('Сказка удалена');
```

---

#### `getUserStories(userId: string): Promise<Story[]>`

Получение всех сказок пользователя.

**Параметры:**
- `userId: string` - UUID пользователя

**Возвращает:**
```typescript
Story[] // Массив сказок автора
```

**Пример:**
```typescript
const myStories = await storiesService.getUserStories(user.id);
console.log(`У вас ${myStories.length} сказок`);
```

---

#### `searchStories(query: string): Promise<Story[]>`

Поиск сказок по тексту.

**Параметры:**
- `query: string` - Поисковый запрос

**Возвращает:**
```typescript
Story[] // Найденные сказки
```

**Особенности:**
- Поиск по названию и содержимому
- Case-insensitive
- Пустой запрос → пустой массив

**Пример:**
```typescript
const results = await storiesService.searchStories('волшебный');
console.log(`Найдено сказок: ${results.length}`);
```

---

## 📤 FileUploadService

Сервис для загрузки файлов в Supabase Storage.

**Расположение**: `src/services/FileUploadService.ts`

### Методы

#### `uploadCoverImage(file: File, storyId: string): Promise<string>`

Загрузка обложки для сказки.

**Параметры:**
- `file: File` - Файл изображения
- `storyId: string` - ID сказки

**Возвращает:**
```typescript
string // Публичный URL загруженного файла
```

**Валидация:**
- Размер: max 5MB
- Форматы: image/jpeg, image/png, image/webp

**Пример:**
```typescript
const fileService = inject('fileUploadService');

const url = await fileService.uploadCoverImage(
  coverFile,
  'story-uuid'
);

console.log('Обложка загружена:', url);
```

---

#### `deleteCoverImage(storyId: string): Promise<void>`

Удаление обложки сказки.

**Параметры:**
- `storyId: string` - ID сказки

**Пример:**
```typescript
await fileService.deleteCoverImage('story-uuid');
```

---

## 📝 LoggerService

Централизованный сервис логирования.

**Расположение**: `src/services/LoggerService.ts`  
**Интерфейс**: `ILogger`

### Методы

#### `info(message: string, ...args: unknown[]): void`

Информационное сообщение.

**Пример:**
```typescript
const logger = inject('logger');
logger.info('Пользователь вошел в систему', { userId: '123' });
```

---

#### `debug(message: string, ...args: unknown[]): void`

Отладочное сообщение (только в dev).

**Пример:**
```typescript
logger.debug('API call', { endpoint: '/stories', params });
```

---

#### `warn(message: string, ...args: unknown[]): void`

Предупреждение.

**Пример:**
```typescript
logger.warn('Кеш устарел', { key: 'stories' });
```

---

#### `error(message: string, ...args: unknown[]): void`

Ошибка.

**Пример:**
```typescript
try {
  await someOperation();
} catch (error) {
  logger.error('Ошибка операции', error);
}
```

---

## 💾 StoriesRepository

Репозиторий для работы с БД (слой доступа к данным).

**Расположение**: `src/repositories/StoriesRepository.ts`  
**Интерфейс**: `IStoriesRepository`

### Методы

Имеет те же методы, что и StoriesService, но без валидации. Напрямую работает с Supabase.

#### Особенности:

1. **Кеширование через ExecutionQueue**
   ```typescript
   const stories = await this._executionQueue.execute(
     ['stories', 'paginated', page],
     () => this._fetchStoriesFromDB(),
     { ttl: 60000 } // Кеш на 1 минуту
   );
   ```

2. **SQL запросы через Supabase**
   ```typescript
   const { data, error } = await supabase
     .from('stories')
     .select('*, profiles!stories_author_id_fkey(*)')
     .eq('is_published', true)
     .order('created_at', { ascending: false });
   ```

3. **Трансформация данных**
   ```typescript
   // Преобразование ответа БД в типы приложения
   const stories: Story[] = data.map(row => ({
     id: row.id,
     title: row.title,
     content: row.content,
     author: {
       id: row.profiles.id,
       username: row.profiles.username
     }
   }));
   ```

---

## 🔄 ExecutionQueue

Система кеширования и управления запросами.

**Расположение**: `src/libs/async/ExecutionQueue.ts`

### Методы

#### `execute<T>(key: string[], fn: () => Promise<T>, options?: ExecuteOptions): Promise<T>`

Выполнение функции с кешированием.

**Параметры:**
```typescript
interface ExecuteOptions {
  ttl?: number;          // Time to live (ms)
  forceRefresh?: boolean; // Игнорировать кеш
}
```

**Пример:**
```typescript
const queue = inject('executionQueue');

const data = await queue.execute(
  ['user', userId, 'stories'],
  () => fetchUserStories(userId),
  { ttl: 60000 } // 1 минута
);
```

---

#### `clearCache(key: string[]): void`

Очистка конкретного ключа кеша.

**Пример:**
```typescript
queue.clearCache(['user', '123', 'stories']);
```

---

#### `clearCacheByPattern(pattern: string[]): void`

Очистка кеша по паттерну.

**Пример:**
```typescript
// Очистить все кеши, связанные со сказками
queue.clearCacheByPattern(['stories']);

// Очистить кеш пользователя
queue.clearCacheByPattern(['user', userId]);
```

---

## 🗄️ Supabase API

### Database

#### Таблицы:

**profiles**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT NOT NULL,
  avatar_url TEXT,
  is_moderator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**stories**
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,           -- JSON от Tiptap
  content_text TEXT NOT NULL,      -- Чистый текст для поиска
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

#### Политики для stories:

**SELECT (чтение)**
```sql
-- Все могут читать опубликованные сказки
CREATE POLICY "Anyone can view published stories"
ON stories FOR SELECT
USING (is_published = true OR auth.uid() = author_id);
```

**INSERT (создание)**
```sql
-- Только модераторы могут создавать
CREATE POLICY "Moderators can create stories"
ON stories FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_moderator = true
  )
);
```

**UPDATE (обновление)**
```sql
-- Модераторы могут редактировать любые
CREATE POLICY "Moderators can update stories"
ON stories FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_moderator = true
  )
);
```

**DELETE (удаление)**
```sql
-- Модераторы могут удалять любые
CREATE POLICY "Moderators can delete stories"
ON stories FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_moderator = true
  )
);
```

### Storage

**Bucket**: `story-covers`

**Политики:**
- Все могут читать (публичный bucket)
- Только модераторы могут загружать
- Только модераторы могут удалять

---

## 🔐 Authentication API

### Регистрация

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      username: 'User Name'
    }
  }
});
```

### Вход

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Выход

```typescript
await supabase.auth.signOut();
```

### Получение текущего пользователя

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Слушатель изменений

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('Пользователь вошел');
    }
    if (event === 'SIGNED_OUT') {
      console.log('Пользователь вышел');
    }
  }
);
```

---

## 🎯 Типы данных

### Story

```typescript
interface Story {
  id: string;
  title: string;
  content: string;          // JSON от Tiptap
  content_text: string;     // Чистый текст
  cover_image_url?: string;
  author_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author?: User;
}
```

### User

```typescript
interface User {
  id: string;
  username: string;
  avatar_url?: string;
  is_moderator?: boolean;
  created_at: string;
}
```

### AuthUser

```typescript
interface AuthUser {
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
```

---

*API документация актуализирована: октябрь 2025*

