# 📁 Структура проекта

## Обзор

Проект организован согласно лучшим практикам Next.js 15 с использованием App Router и модульной архитектуры.

## Корневая структура

```
dads_fairy_tales/
├── docs/                    # 📚 Документация проекта
├── public/                  # 🌐 Статические файлы
├── src/                     # 💻 Исходный код
├── node_modules/            # 📦 Зависимости
├── .env.example             # 🔐 Пример переменных окружения
├── .gitignore               # 🚫 Игнорируемые файлы
├── eslint.config.mjs        # ⚙️ Конфигурация ESLint
├── next.config.ts           # ⚙️ Конфигурация Next.js
├── next-env.d.ts            # 📝 TypeScript определения Next.js
├── package.json             # 📦 Зависимости и скрипты
├── package-lock.json        # 🔒 Локированные версии
├── README.md                # 📖 Основное README
├── supabase-schema.sql      # 🗄️ Схема базы данных
└── tsconfig.json            # ⚙️ Конфигурация TypeScript
```

## src/ - Исходный код

Главная папка со всем кодом приложения.

```
src/
├── app/                     # 📱 Next.js App Router (страницы)
├── components/              # 🧩 React компоненты
├── hooks/                   # 🎣 Custom React hooks
├── interfaces/              # 📋 TypeScript интерфейсы
├── lib/                     # 🛠️ Утилиты и хелперы
├── libs/                    # 📚 Внутренние библиотеки
├── providers/               # 🔌 React Context Providers
├── repositories/            # 💾 Слой доступа к данным
├── services/                # ⚙️ Бизнес-логика
├── store/                   # 🗄️ Redux store
└── types/                   # 📝 TypeScript типы
```

---

## 📱 app/ - Страницы приложения

Next.js App Router с file-based маршрутизацией.

```
app/
├── layout.tsx              # Главный layout (Header, Footer)
├── page.tsx                # Главная страница (/)
├── page.module.css         # Стили главной страницы
├── globals.css             # Глобальные стили
├── favicon.ico             # Иконка сайта
│
├── about/                  # Страница "О нас" (/about)
│   ├── page.tsx
│   └── page.module.css
│
├── profile/                # Профиль пользователя (/profile)
│   ├── page.tsx
│   └── page.module.css
│
├── stories/                # Библиотека сказок (/stories)
│   ├── page.tsx
│   └── page.module.css
│
├── story/                  # Отдельная сказка
│   └── [id]/              # Динамический роут (/story/[id])
│       ├── page.tsx
│       └── page.module.css
│
├── robots.ts               # SEO: robots.txt
└── sitemap.ts              # SEO: sitemap.xml
```

### Особенности:
- **File-based routing**: каждая папка = маршрут
- **Dynamic routes**: `[id]` для параметров
- **Layouts**: переиспользуемая структура
- **CSS Modules**: изолированные стили
- **SEO**: metadata в каждом page.tsx

---

## 🧩 components/ - React компоненты

Все переиспользуемые UI компоненты организованы по функциональному назначению.

```
components/
├── auth/                   # Компоненты аутентификации
│   ├── AuthButton/
│   │   ├── AuthButton.tsx
│   │   └── AuthButton.module.css
│   ├── AuthModal/
│   │   ├── AuthModal.tsx
│   │   └── AuthModal.module.css
│   └── AuthProvider/
│       └── AuthProvider.tsx
│
├── layout/                 # Layout компоненты
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   └── Footer/
│       ├── Footer.tsx
│       └── Footer.module.css
│
├── modals/                 # Модальные окна
│   └── CreateStoryModal/
│       ├── CreateStoryModal.tsx
│       └── CreateStoryModal.module.css
│
├── story/                  # Компоненты для сказок
│   ├── RichTextEditor/
│   │   ├── RichTextEditor.tsx
│   │   └── RichTextEditor.module.css
│   └── StoryCard/
│       ├── StoryCard.tsx
│       └── StoryCard.module.css
│
└── ui/                     # Базовые UI компоненты
    ├── index.ts           # Экспорт всех UI компонентов
    ├── Button/
    │   ├── Button.tsx
    │   └── Button.module.css
    ├── Input/
    │   ├── Input.tsx
    │   └── Input.module.css
    ├── Modal/
    │   ├── Modal.tsx
    │   └── Modal.module.css
    ├── Pagination/
    │   ├── Pagination.tsx
    │   └── Pagination.module.css
    ├── Select/
    │   ├── Select.tsx
    │   └── Select.module.css
    └── BackButton/
        └── BackButton.tsx
```

### Принципы организации:
- **По функциональности**: auth, layout, ui
- **Colocation**: компонент + стили в одной папке
- **Barrel exports**: `ui/index.ts` для удобного импорта
- **Naming**: PascalCase для папок и файлов компонентов

---

## 🎣 hooks/ - Custom Hooks

Переиспользуемая логика состояния и side effects.

```
hooks/
├── index.ts                # Экспорт всех хуков
├── useAppDispatch.ts       # Типизированный dispatch
├── useAppSelector.ts       # Типизированный selector
├── useAuth.ts              # Хук для аутентификации
├── useStories.ts           # Хук для работы со сказками
└── useUI.ts                # Хук для UI состояния
```

### Назначение хуков:

- **useAppDispatch**: типизированная версия `useDispatch` из Redux
- **useAppSelector**: типизированная версия `useSelector` из Redux
- **useAuth**: работа с состоянием аутентификации (user, login, logout)
- **useStories**: работа со сказками (список, создание, удаление)
- **useUI**: управление UI (модалки, тосты, theme)

---

## 📋 interfaces/ - Интерфейсы сервисов

TypeScript интерфейсы для инверсии зависимостей.

```
interfaces/
├── index.ts                # Экспорт всех интерфейсов
├── ILogger.ts              # Интерфейс логгера
├── IStoriesRepository.ts   # Интерфейс репозитория сказок
└── IStoriesService.ts      # Интерфейс сервиса сказок
```

### Назначение:
- Определение контрактов для сервисов
- Dependency Injection
- Тестируемость (мокирование)

---

## 🛠️ lib/ - Утилиты

Вспомогательные функции и конфигурации.

```
lib/
├── auth.ts                 # Функции аутентификации
├── database.types.ts       # Типы из Supabase
├── readingTime.ts          # Расчет времени чтения
├── supabase.ts             # Supabase клиент
└── utils.ts                # Общие утилиты
```

### Основные функции:

- **auth.ts**: `getUserWithModeratorStatus()` - получение пользователя с ролью
- **readingTime.ts**: `getReadingTime()` - расчет времени чтения сказки
- **supabase.ts**: `supabase` - настроенный клиент Supabase
- **utils.ts**: общие helper функции

---

## 📚 libs/ - Внутренние библиотеки

Переиспользуемые библиотеки архитектурного уровня.

```
libs/
├── async/                  # Асинхронные утилиты
│   ├── ExecutionQueue.ts   # Кеширование и очередь
│   └── index.ts
│
└── di/                     # Dependency Injection
    ├── DependencyRegistry.ts
    ├── diRegistry.ts       # Глобальный реестр
    ├── inject.ts           # Функция внедрения
    ├── types.ts            # Типы DI системы
    └── index.ts
```

### Назначение:

- **ExecutionQueue**: кеширование запросов, дедупликация
- **DI System**: внедрение зависимостей, Singleton управление

---

## 💾 repositories/ - Репозитории

Слой доступа к данным (Data Access Layer).

```
repositories/
├── index.ts
└── StoriesRepository.ts    # Репозиторий для работы со сказками
```

### Ответственность:
- CRUD операции с БД
- Трансформация данных
- Кеширование через ExecutionQueue
- SQL запросы через Supabase

---

## ⚙️ services/ - Сервисы

Бизнес-логика приложения.

```
services/
├── index.ts
├── FileUploadService.ts    # Загрузка файлов в Supabase Storage
├── LoggerService.ts        # Централизованное логирование
└── stories.ts              # Бизнес-логика сказок (StoriesService)
```

### Ответственность:
- Валидация входных данных
- Бизнес-правила
- Координация между репозиториями
- Логирование операций

---

## 🗄️ store/ - Redux Store

Глобальное состояние приложения.

```
store/
├── index.ts                # Конфигурация store
└── slices/
    ├── index.ts
    ├── authSlice.ts        # Состояние аутентификации
    ├── storiesSlice.ts     # Состояние сказок
    └── uiSlice.ts          # Состояние UI
```

### Структура slice:

```typescript
// authSlice.ts
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { /* actions */ },
  selectors: { /* selectors */ }
});
```

---

## 📝 types/ - TypeScript типы

Общие типы приложения.

```
types/
└── index.ts                # Все типы (Story, User, API responses)
```

### Основные типы:
- `Story` - сказка
- `User` - пользователь
- `AuthUser` - авторизованный пользователь
- `PaginatedResponse` - ответ с пагинацией
- `StoryFilters` - фильтры для сказок

---

## 🔌 providers/ - Context Providers

React Context провайдеры.

```
providers/
└── ReduxProvider.tsx       # Provider для Redux store
```

---

## 🌐 public/ - Статические файлы

Публичные файлы, доступные по URL.

```
public/
├── file.svg
├── globe.svg
├── next.svg
├── vercel.svg
└── window.svg
```

---

## Именование файлов

### Конвенции:

1. **Компоненты**: PascalCase
   - `Button.tsx`
   - `AuthModal.tsx`

2. **Хуки**: camelCase с префиксом `use`
   - `useAuth.ts`
   - `useStories.ts`

3. **Утилиты**: camelCase
   - `readingTime.ts`
   - `utils.ts`

4. **Типы/Интерфейсы**: PascalCase с префиксом `I` для интерфейсов
   - `ILogger.ts`
   - `types/index.ts`

5. **Стили**: Component.module.css
   - `Button.module.css`
   - `Header.module.css`

6. **Константы**: UPPER_SNAKE_CASE
   - `API_URL`
   - `MAX_FILE_SIZE`

---

## Импорты

### Алиасы:

```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "~/*": ["./src/*"]
  }
}
```

### Примеры использования:

```typescript
// Вместо относительных путей
import { Button } from '../../../components/ui';

// Используем алиасы
import { Button } from '@/components/ui';
import { useAuth } from '~/hooks';
```

---

*Структура проекта актуализирована: октябрь 2025*

