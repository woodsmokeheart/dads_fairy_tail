# 🛠️ Руководство разработчика

## Быстрый старт

### Предварительные требования

- **Node.js**: версия 18.x или выше
- **npm**: версия 9.x или выше
- **Git**: для клонирования репозитория
- **Аккаунт Supabase**: для backend и БД

### Установка

#### 1. Клонирование репозитория

```bash
git clone https://github.com/yourusername/dads_fairy_tales.git
cd dads_fairy_tales
```

#### 2. Установка зависимостей

```bash
npm install
```

#### 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
cp .env.example .env.local
```

Заполните переменные:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional
NODE_ENV=development
```

**Где получить Supabase credentials:**

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект или откройте существующий
3. Перейдите в Settings → API
4. Скопируйте:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` ключ → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 4. Настройка базы данных

Выполните SQL из `supabase-schema.sql` в Supabase SQL Editor:

1. Откройте проект в Supabase Dashboard
2. Перейдите в SQL Editor
3. Создайте новый query
4. Скопируйте содержимое `supabase-schema.sql`
5. Выполните (Run)

#### 5. Запуск в dev режиме

```bash
npm run dev
```

Приложение будет доступно на [http://localhost:3000](http://localhost:3000)

---

## Структура команд

### Development

```bash
# Запуск dev сервера с Turbopack
npm run dev

# Запуск без Turbopack (если нужно)
next dev
```

### Production

```bash
# Создание production build
npm run build

# Запуск production сервера
npm start
```

### Linting

```bash
# Проверка кода
npm run lint

# Автоматическое исправление (если настроено)
npx eslint . --fix
```

### TypeScript

```bash
# Проверка типов
npx tsc --noEmit
```

---

## Рабочий процесс

### Git Flow

Проект использует упрощенный Git Flow:

```
main (production)
  ↑
develop (staging)
  ↑
feature/* (новые фичи)
  ↑
hotfix/* (срочные исправления)
```

#### Создание новой фичи

```bash
# Создать ветку от develop
git checkout develop
git pull origin develop
git checkout -b feature/my-new-feature

# Разработка...
git add .
git commit -m "feat: добавлена новая фича"

# Push и создание PR
git push origin feature/my-new-feature
```

#### Commit Convention

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: новая функциональность
fix: исправление бага
docs: изменения в документации
style: форматирование кода
refactor: рефакторинг без изменения функциональности
test: добавление тестов
chore: изменения в сборке или вспомогательных инструментах
```

**Примеры:**

```bash
git commit -m "feat: добавлена пагинация для сказок"
git commit -m "fix: исправлена ошибка при удалении сказки"
git commit -m "docs: обновлена документация API"
git commit -m "refactor: переписан StoriesService"
```

---

## Добавление новой функциональности

### Создание нового компонента

#### 1. Создать папку и файлы

```bash
mkdir -p src/components/ui/MyComponent
touch src/components/ui/MyComponent/MyComponent.tsx
touch src/components/ui/MyComponent/MyComponent.module.css
```

#### 2. Базовая структура компонента

```typescript
// MyComponent.tsx
'use client'; // если нужен клиентский компонент

import React from 'react';
import styles from './MyComponent.module.css';

export interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onClick 
}) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
};

export default MyComponent;
```

#### 3. Стили

```css
/* MyComponent.module.css */
.container {
  padding: 1rem;
  border-radius: 8px;
  background: var(--bg-secondary);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
}
```

#### 4. Экспорт (если ui компонент)

```typescript
// src/components/ui/index.ts
export { default as MyComponent } from './MyComponent/MyComponent';
```

---

### Создание нового сервиса

#### 1. Создать интерфейс

```typescript
// src/interfaces/IMyService.ts
export interface IMyService {
  doSomething(param: string): Promise<void>;
}
```

#### 2. Реализовать сервис

```typescript
// src/services/MyService.ts
import { IMyService } from '~/interfaces';

export class MyService implements IMyService {
  private static _instance?: IMyService;

  static getInstance(): IMyService {
    if (!MyService._instance) {
      MyService._instance = new MyService();
    }
    return MyService._instance;
  }

  async doSomething(param: string): Promise<void> {
    // Реализация
  }
}
```

#### 3. Зарегистрировать в DI

```typescript
// src/libs/di/diRegistry.ts
import { MyService } from '~/services/MyService';

diRegistry.register('myService', { 
  getInstance: () => MyService.getInstance() 
});
```

#### 4. Добавить тип в Dependencies

```typescript
// src/libs/di/types.ts
import { IMyService } from '~/interfaces';

export interface Dependencies {
  myService: IMyService;
  // ... другие сервисы
}
```

#### 5. Использовать в компонентах

```typescript
import { inject } from '~/libs/di';

const myService = inject('myService');
await myService.doSomething('test');
```

---

### Создание новой страницы

#### 1. Создать папку в app/

```bash
mkdir -p src/app/my-page
touch src/app/my-page/page.tsx
touch src/app/my-page/page.module.css
```

#### 2. Создать компонент страницы

```typescript
// src/app/my-page/page.tsx
import { Metadata } from 'next';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Моя страница - Папины сказки',
  description: 'Описание страницы',
};

export default function MyPage() {
  return (
    <div className={styles.container}>
      <h1>Моя страница</h1>
    </div>
  );
}
```

#### 3. Добавить ссылку в навигацию

```typescript
// src/components/layout/Header/Header.tsx
<Link href="/my-page">Моя страница</Link>
```

---

### Добавление нового slice в Redux

#### 1. Создать slice

```typescript
// src/store/slices/mySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MyState {
  data: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MyState = {
  data: [],
  loading: false,
  error: null,
};

export const mySlice = createSlice({
  name: 'my',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  selectors: {
    selectData: (state: MyState) => state.data,
    selectLoading: (state: MyState) => state.loading,
  },
});

export const {
  actions: myActions,
  reducer: myReducer,
  selectors: mySelectors,
} = mySlice;
```

#### 2. Добавить в store

```typescript
// src/store/index.ts
import { myReducer } from './slices/mySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stories: storiesReducer,
    ui: uiReducer,
    my: myReducer, // добавить
  },
});
```

#### 3. Создать hook

```typescript
// src/hooks/useMy.ts
import { useAppDispatch, useAppSelector } from './';
import { myActions, mySelectors } from '~/store/slices/mySlice';

export const useMy = () => {
  const data = useAppSelector(mySelectors.selectData);
  const loading = useAppSelector(mySelectors.selectLoading);
  const dispatch = useAppDispatch();

  const setData = (newData: string[]) => {
    dispatch(myActions.setData(newData));
  };

  return {
    data,
    loading,
    setData,
  };
};
```

#### 4. Экспортировать

```typescript
// src/hooks/index.ts
export { useMy } from './useMy';
```

---

## Работа с базой данных

### Добавление новой таблицы

#### 1. SQL миграция

Создайте файл `migrations/001_add_comments.sql`:

```sql
-- Создание таблицы
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);

-- RLS политики
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
ON comments FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);
```

#### 2. Применить миграцию

В Supabase Dashboard → SQL Editor → выполните SQL

#### 3. Обновить типы

```typescript
// src/types/index.ts
export interface Comment {
  id: string;
  story_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: User;
}
```

---

## Отладка

### Логирование

Используйте LoggerService для структурированного логирования:

```typescript
import { inject } from '~/libs/di';

const logger = inject('logger');

// Информация
logger.info('Операция начата', { userId: '123' });

// Отладка (только в dev)
logger.debug('Промежуточный результат', { data });

// Предупреждение
logger.warn('Кеш устарел', { key });

// Ошибка
try {
  await operation();
} catch (error) {
  logger.error('Ошибка операции', error);
}
```

### React DevTools

Установите [React DevTools](https://react.dev/learn/react-developer-tools) для отладки компонентов.

### Redux DevTools

Установите [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) для отладки состояния.

### Next.js Debug Mode

```bash
NODE_OPTIONS='--inspect' npm run dev
```

Откройте `chrome://inspect` в Chrome для подключения debugger.

---

## Тестирование

### Подготовка (когда будет настроено)

```bash
# Установка зависимостей для тестов
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### Запуск тестов

```bash
# Все тесты
npm test

# Конкретный файл
npm test MyComponent.test.tsx

# С coverage
npm test -- --coverage
```

### Написание теста компонента

```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    const title = screen.getByText('Test');
    expect(title).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<MyComponent title="Test" onClick={handleClick} />);
    
    const element = screen.getByText('Test');
    element.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## Code Style

### ESLint

Проект использует ESLint для поддержания качества кода.

**Основные правила:**
- Использовать TypeScript (строгий режим)
- Избегать `any` (комментарий обязателен, если используется)
- Всегда указывать типы для props
- Использовать функциональные компоненты
- Хуки в начале компонента

### Форматирование

**Общие правила:**
- Отступы: 2 пробела
- Точка с запятой: обязательна
- Кавычки: одинарные
- Trailing comma: es5
- Arrow functions: всегда в одну строку, если возможно

### Именование

**Файлы:**
- Компоненты: `PascalCase.tsx`
- Хуки: `useCamelCase.ts`
- Утилиты: `camelCase.ts`
- Типы: `PascalCase.ts` или `index.ts`
- Стили: `Component.module.css`

**Переменные:**
- camelCase для переменных и функций
- PascalCase для компонентов и типов
- UPPER_SNAKE_CASE для констант
- Префикс `I` для интерфейсов: `IMyService`
- Префикс `_` для приватных полей: `_repository`

---

## Производительность

### Оптимизация компонентов

```typescript
// React.memo для предотвращения лишних рендеров
import React, { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

```typescript
// useMemo для тяжелых вычислений
import { useMemo } from 'react';

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

```typescript
// useCallback для функций в deps
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

### Оптимизация изображений

Всегда используйте Next.js Image:

```typescript
import Image from 'next/image';

<Image
  src="/cover.jpg"
  alt="Обложка"
  width={400}
  height={300}
  priority // для важных изображений
/>
```

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Загрузка...</div>,
  ssr: false, // если не нужен SSR
});
```

---

## Deployment

### Vercel (рекомендуется)

#### Автоматический deploy

1. Push в `main` ветку
2. Vercel автоматически создаст deploy
3. Проверьте deployment в Vercel Dashboard

#### Ручной deploy

```bash
# Установить Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

### Environment Variables в Vercel

1. Откройте проект в Vercel Dashboard
2. Settings → Environment Variables
3. Добавьте:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy проекта

---

## Troubleshooting

### Проблема: "Module not found"

**Решение:**
```bash
# Очистить cache
rm -rf .next
rm -rf node_modules
npm install
```

### Проблема: TypeScript ошибки

**Решение:**
```bash
# Проверить типы
npx tsc --noEmit

# Перезапустить TS server в VSCode
Cmd+Shift+P → TypeScript: Restart TS Server
```

### Проблема: Supabase не подключается

**Решение:**
- Проверьте `.env.local`
- Убедитесь, что переменные начинаются с `NEXT_PUBLIC_`
- Перезапустите dev server

### Проблема: Стили не применяются

**Решение:**
- Проверьте import стилей
- Убедитесь, что классы используются через `styles.className`
- Очистите cache браузера

---

## Полезные ссылки

### Документация технологий

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Supabase](https://supabase.com/docs)
- [Tiptap](https://tiptap.dev)

### Инструменты разработчика

- [VSCode](https://code.visualstudio.com)
- [Cursor](https://cursor.sh)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

### Расширения VSCode (рекомендуется)

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- CSS Modules
- Git Lens
- Thunder Client (для API тестирования)

---

## Контакты команды

- **Lead Developer**: [M1](https://t.me/url64)
- **GitHub Issues**: [Создать issue](https://github.com/yourusername/dads_fairy_tales/issues)

---

*Руководство разработчика обновлено: октябрь 2025*

