# 🏗️ Архитектура приложения

## Общий обзор

**"Папины сказки"** построен на современной архитектуре с использованием React-экосистемы и лучших практик разработки.

```
┌─────────────────────────────────────────────────┐
│              Презентационный слой               │
│         (Next.js 15 + React 19 + CSS)          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│            Слой управления состоянием           │
│     (Redux Toolkit + Custom Hooks + DI)        │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│               Бизнес-логика (Services)          │
│  (StoriesService, FileUploadService, Logger)   │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│            Слой доступа к данным                │
│            (Repositories + Supabase)            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  База данных                    │
│              (Supabase PostgreSQL)              │
└─────────────────────────────────────────────────┘
```

## Архитектурные паттерны

### 1. **Layered Architecture (Слоистая архитектура)**

Приложение разделено на несколько слоев с четкими границами ответственности:

#### **Presentation Layer (Презентационный слой)**
- **Расположение**: `src/app/`, `src/components/`
- **Ответственность**: 
  - Отображение пользовательского интерфейса
  - Обработка пользовательского ввода
  - Навигация
- **Технологии**: Next.js App Router, React Components, CSS Modules

#### **State Management Layer (Слой управления состоянием)**
- **Расположение**: `src/store/`, `src/hooks/`
- **Ответственность**:
  - Глобальное состояние приложения
  - Бизнес-логика на стороне клиента
  - Кастомные хуки для переиспользования логики
- **Технологии**: Redux Toolkit, Custom Hooks

#### **Business Logic Layer (Слой бизнес-логики)**
- **Расположение**: `src/services/`
- **Ответственность**:
  - Валидация данных
  - Бизнес-правила
  - Координация между компонентами
- **Паттерны**: Service Pattern, Singleton

#### **Data Access Layer (Слой доступа к данным)**
- **Расположение**: `src/repositories/`
- **Ответственность**:
  - Взаимодействие с БД
  - Кеширование запросов
  - Трансформация данных
- **Паттерны**: Repository Pattern, Dependency Injection

### 2. **Dependency Injection (Внедрение зависимостей)**

Используем кастомную систему DI для управления зависимостями:

```typescript
// Регистрация зависимостей
diRegistry.register('storiesService', StoriesService);
diRegistry.register('logger', LoggerService);

// Использование в компонентах
const storiesService = inject('storiesService');
const logger = inject('logger');
```

**Преимущества:**
- Слабая связанность компонентов
- Легкое тестирование (можно подменять зависимости)
- Singleton паттерн из коробки
- Централизованное управление сервисами

### 3. **Repository Pattern (Паттерн Репозиторий)**

Изоляция логики работы с данными от бизнес-логики:

```typescript
interface IStoriesRepository {
  getStories(filters?: StoryFilters): Promise<Story[]>;
  getStoryById(id: string): Promise<Story | null>;
  createStory(data: CreateStoryData): Promise<Story>;
  updateStory(id: string, data: UpdateStoryData): Promise<Story>;
  deleteStory(id: string): Promise<void>;
}
```

**Преимущества:**
- Единая точка доступа к данным
- Легко заменить источник данных
- Инкапсуляция логики запросов

### 4. **Service Pattern (Паттерн Сервис)**

Бизнес-логика вынесена в сервисы:

```typescript
class StoriesService implements IStoriesService {
  constructor(
    private readonly _storiesRepository: IStoriesRepository,
    private readonly _logger: ILogger
  ) {}

  async createStory(data: CreateStoryData): Promise<Story> {
    // Валидация
    if (!data.title.trim()) {
      throw new Error('Название сказки не может быть пустым');
    }
    
    // Делегирование репозиторию
    return await this._storiesRepository.createStory(data);
  }
}
```

### 5. **Facade Pattern (Паттерн Фасад)**

Кастомные хуки как фасад для Redux Store:

```typescript
// useAuth - фасад для authSlice
export const useAuth = () => {
  const user = useAppSelector(authSelectors.selectUser);
  const dispatch = useAppDispatch();
  
  const setUser = (user: AuthUser | null) => {
    dispatch(authActions.setUser(user));
  };
  
  return { user, setUser, ... };
};
```

## Структура данных

### State Management (Redux Toolkit)

```
Store
├── auth (authSlice)
│   ├── user: AuthUser | null
│   ├── loading: boolean
│   └── error: string | null
│
├── stories (storiesSlice)
│   ├── stories: Story[]
│   ├── currentStory: Story | null
│   ├── loading: boolean
│   └── error: string | null
│
└── ui (uiSlice)
    ├── isAuthModalOpen: boolean
    ├── isCreateStoryModalOpen: boolean
    ├── toast: { message, type } | null
    └── theme: 'light' | 'dark'
```

### Database Schema (Supabase)

```sql
-- Таблица пользователей
profiles (
  id: UUID PRIMARY KEY,
  username: TEXT,
  avatar_url: TEXT,
  is_moderator: BOOLEAN,
  created_at: TIMESTAMP
)

-- Таблица сказок
stories (
  id: UUID PRIMARY KEY,
  title: TEXT NOT NULL,
  content: TEXT NOT NULL,      -- JSON от Tiptap
  content_text: TEXT NOT NULL,  -- Чистый текст для поиска
  cover_image_url: TEXT,
  author_id: UUID REFERENCES profiles(id),
  is_published: BOOLEAN,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

## Потоки данных

### 1. **Загрузка сказок**

```
[Component] 
    ↓ (useEffect)
[Custom Hook] (useStories)
    ↓ (inject)
[Service] (StoriesService)
    ↓
[Repository] (StoriesRepository)
    ↓ (Supabase Client)
[Database] (Supabase PostgreSQL)
    ↓ (response)
[Redux Store] (storiesSlice)
    ↓ (useSelector)
[Component] (re-render)
```

### 2. **Создание сказки**

```
[Component] (CreateStoryModal)
    ↓ (handleSubmit)
[Service] (StoriesService)
    ↓ (validation)
[FileUploadService] (если есть обложка)
    ↓ (upload to Supabase Storage)
[Repository] (StoriesRepository)
    ↓ (createStory)
[Database] (INSERT)
    ↓ (clear cache)
[ExecutionQueue] (clearCacheByPattern)
    ↓ (refresh data)
[Component] (re-fetch & update)
```

### 3. **Аутентификация**

```
[Component] (AuthButton)
    ↓ (login)
[Supabase Auth] (signIn)
    ↓ (onAuthStateChange)
[AuthProvider] (listener)
    ↓ (getUserWithModeratorStatus)
[Supabase] (get profile)
    ↓ (dispatch)
[Redux Store] (authSlice)
    ↓ (useSelector)
[All Components] (access user)
```

## Оптимизация производительности

### 1. **Кеширование запросов**

Используем `ExecutionQueue` для кеширования результатов:

```typescript
// Автоматическое кеширование с TTL
const stories = await executionQueue.execute(
  ['stories', 'paginated', page],
  () => storiesRepository.getStoriesPaginated(...),
  { ttl: 60000 } // 1 минута
);
```

### 2. **Пагинация**

Все списки сказок используют пагинацию:
- Ограничение: 6 сказок на странице
- Server-side пагинация (SQL LIMIT/OFFSET)
- Навигация: предыдущая/следующая страница

### 3. **Lazy Loading**

- Динамические импорты для модалов
- Next.js автоматическая оптимизация компонентов
- Image optimization с Next.js Image component

### 4. **Memo и useMemo**

- Мемоизация тяжелых вычислений
- React.memo для компонентов без частых изменений

## Безопасность

### 1. **Row Level Security (RLS) в Supabase**

Политики безопасности на уровне БД:
- Только модераторы могут создавать/удалять сказки
- Пользователи видят только опубликованные сказки
- Авторы могут редактировать только свои сказки

### 2. **Валидация на клиенте и сервере**

- Client-side: react-hook-form + zod
- Server-side: валидация в сервисах
- Sanitization HTML контента

### 3. **Аутентификация и авторизация**

- JWT токены через Supabase Auth
- Проверка прав доступа на каждом эндпоинте
- Secure cookies для сессий

## Масштабируемость

### Горизонтальное масштабирование

- **Stateless компоненты**: вся состояние в Redux или БД
- **CDN**: статические ресурсы через Vercel Edge Network
- **Database**: Supabase масштабируется автоматически

### Вертикальное масштабирование

- **Code splitting**: Next.js автоматически разделяет код
- **Tree shaking**: удаление неиспользуемого кода
- **Compression**: Gzip/Brotli сжатие

## Тестирование (планируется)

### Unit тесты
- Тестирование сервисов
- Тестирование редьюсеров и селекторов
- Тестирование utility функций

### Integration тесты
- Тестирование хуков
- Тестирование компонентов с контекстом

### E2E тесты
- Критические пользовательские сценарии
- Playwright или Cypress

## Развертывание

### Архитектура деплоя

```
[GitHub Repository]
    ↓ (push)
[Vercel CI/CD]
    ↓ (build & test)
[Vercel Edge Network]
    ↓
[Users worldwide]

[Supabase Dashboard]
    ↓ (migrations)
[Supabase PostgreSQL]
    ↓
[Application]
```

### Окружения

1. **Development**: локальная разработка
2. **Preview**: автоматические preview для PR
3. **Production**: основной сайт

## Мониторинг и логирование

### LoggerService

Централизованное логирование:
```typescript
logger.info('User logged in', { userId });
logger.error('Failed to create story', error);
logger.debug('API call', { endpoint, params });
```

### Метрики (планируется)

- Время загрузки страниц
- Количество ошибок
- Популярные сказки
- Активность пользователей

---

*Архитектура актуализирована: октябрь 2025*

