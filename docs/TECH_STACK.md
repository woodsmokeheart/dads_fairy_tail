# 🛠️ Технологический стек

## Обзор технологий

Проект "Папины сказки" построен на современном стеке технологий с акцентом на производительность, масштабируемость и developer experience.

```
Frontend (React Ecosystem)
    ↓
State Management (Redux)
    ↓
Backend/Database (Supabase)
    ↓
Deployment (Vercel)
```

## Frontend

### Core Technologies

#### **Next.js 15.5.4**
- **Роль**: Фреймворк для React приложений
- **Возможности**:
  - App Router для маршрутизации
  - Server Side Rendering (SSR)
  - Static Site Generation (SSG)
  - API Routes
  - Image optimization
  - Font optimization
- **Документация**: [nextjs.org](https://nextjs.org)

```json
"next": "15.5.4"
```

#### **React 19.1.0**
- **Роль**: UI библиотека
- **Возможности**:
  - Компонентный подход
  - Hooks
  - Concurrent features
  - Automatic batching
- **Документация**: [react.dev](https://react.dev)

```json
"react": "19.1.0",
"react-dom": "19.1.0"
```

#### **TypeScript 5**
- **Роль**: Типизация кода
- **Возможности**:
  - Статическая типизация
  - IntelliSense в IDE
  - Раннее обнаружение ошибок
  - Улучшенная документация кода
- **Конфигурация**: `tsconfig.json`
- **Документация**: [typescriptlang.org](https://www.typescriptlang.org)

```json
"typescript": "^5"
```

### State Management

#### **Redux Toolkit 2.9.0**
- **Роль**: Управление глобальным состоянием
- **Возможности**:
  - Централизованное хранилище
  - Immutable updates
  - DevTools integration
  - Встроенные middleware
- **Используемые слайсы**:
  - `authSlice` - состояние аутентификации
  - `storiesSlice` - состояние сказок
  - `uiSlice` - состояние UI (модалки, тосты)
- **Документация**: [redux-toolkit.js.org](https://redux-toolkit.js.org)

```json
"@reduxjs/toolkit": "^2.9.0",
"react-redux": "^9.2.0"
```

### Forms & Validation

#### **React Hook Form 7.63.0**
- **Роль**: Управление формами
- **Возможности**:
  - Минимальные ре-рендеры
  - Валидация из коробки
  - Интеграция с Zod
  - Excellent performance
- **Документация**: [react-hook-form.com](https://react-hook-form.com)

```json
"react-hook-form": "^7.63.0"
```

#### **Zod 4.1.11**
- **Роль**: Schema validation
- **Возможности**:
  - TypeScript-first validation
  - Type inference
  - Композиция схем
  - Понятные сообщения об ошибках
- **Документация**: [zod.dev](https://zod.dev)

```json
"zod": "^4.1.11",
"@hookform/resolvers": "^5.2.2"
```

### Rich Text Editor

#### **Tiptap 3.6.2**
- **Роль**: WYSIWYG редактор для сказок
- **Расширения**:
  - `@tiptap/starter-kit` - базовые функции
  - `@tiptap/extension-image` - вставка изображений
  - `@tiptap/extension-link` - ссылки
  - `@tiptap/extension-color` - цвет текста
  - `@tiptap/extension-placeholder` - плейсхолдеры
  - `@tiptap/extension-typography` - типографика
  - `@tiptap/extension-character-count` - подсчет символов
- **Документация**: [tiptap.dev](https://tiptap.dev)

```json
"@tiptap/react": "^3.6.2",
"@tiptap/starter-kit": "^3.6.2",
"@tiptap/extension-character-count": "^3.6.2",
"@tiptap/extension-color": "^3.6.2",
"@tiptap/extension-image": "^3.6.2",
"@tiptap/extension-link": "^3.6.2",
"@tiptap/extension-placeholder": "^3.6.2",
"@tiptap/extension-text-style": "^3.6.2",
"@tiptap/extension-typography": "^3.6.2"
```

### UI & Styling

#### **CSS Modules**
- **Роль**: Стилизация компонентов
- **Преимущества**:
  - Scoped styles
  - Нет конфликтов классов
  - Встроенная поддержка в Next.js
  - CSS переменные для темизации

```css
/* Component.module.css */
.container {
  padding: 1rem;
}
```

#### **Lucide React 0.544.0**
- **Роль**: Библиотека иконок
- **Возможности**:
  - 1000+ иконок
  - Tree-shakeable
  - TypeScript support
  - Customizable размер и цвет
- **Используемые иконки**: BookOpen, User, Plus, Star, Trash, и др.
- **Документация**: [lucide.dev](https://lucide.dev)

```json
"lucide-react": "^0.544.0"
```

#### **clsx 2.1.1**
- **Роль**: Утилита для условных классов
- **Использование**:

```typescript
import clsx from 'clsx';

<div className={clsx(
  styles.button,
  isActive && styles.active,
  isDisabled && styles.disabled
)} />
```

```json
"clsx": "^2.1.1"
```

## Backend & Database

### **Supabase 2.58.0**
- **Роль**: Backend-as-a-Service
- **Компоненты**:
  
  #### **Database (PostgreSQL)**
  - Реляционная база данных
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Full-text search
  
  #### **Authentication**
  - Email/Password auth
  - OAuth providers (планируется)
  - JWT токены
  - Session management
  
  #### **Storage**
  - Файловое хранилище
  - Загрузка обложек сказок
  - Автоматическая оптимизация изображений
  
  #### **Edge Functions** (планируется)
  - Serverless functions
  - Кастомная бизнес-логика

- **Документация**: [supabase.com/docs](https://supabase.com/docs)

```json
"@supabase/supabase-js": "^2.58.0"
```

## Development Tools

### **ESLint 9**
- **Роль**: Линтер кода
- **Конфигурация**: `eslint.config.mjs`
- **Правила**: Next.js recommended + custom rules

```json
"eslint": "^9",
"eslint-config-next": "15.5.4"
```

### **Turbopack**
- **Роль**: Fast bundler (замена Webpack)
- **Использование**: `next dev --turbopack`
- **Преимущества**:
  - Быстрый холодный старт
  - Incremental compilation
  - Встроен в Next.js 15

## Архитектурные библиотеки (Custom)

### **Dependency Injection System**
- **Расположение**: `src/libs/di/`
- **Компоненты**:
  - `DependencyRegistry` - реестр зависимостей
  - `inject()` - функция внедрения
  - `diRegistry` - глобальный реестр

```typescript
// Регистрация
diRegistry.register('logger', LoggerService);

// Использование
const logger = inject('logger');
```

### **Execution Queue**
- **Расположение**: `src/libs/async/`
- **Возможности**:
  - Кеширование запросов
  - TTL для кеша
  - Pattern-based cache clearing
  - Deduplicate одинаковых запросов

```typescript
const result = await executionQueue.execute(
  ['key', param],
  () => fetchData(param),
  { ttl: 60000 }
);
```

## Deployment & Hosting

### **Vercel**
- **Роль**: Хостинг и CI/CD
- **Возможности**:
  - Автоматический деплой из Git
  - Preview deployments для PR
  - Edge Network (CDN)
  - Analytics
  - Web Vitals monitoring
- **Конфигурация**: `next.config.ts`
- **Документация**: [vercel.com/docs](https://vercel.com/docs)

## Browser Support

### Target Browsers
- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)
- Mobile Safari (iOS 14+)
- Chrome Android (последние 2 версии)

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
NODE_ENV=development|production
```

## Scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build --turbopack",
  "start": "next start",
  "lint": "eslint"
}
```

## Версионирование

Проект использует Semantic Versioning (semver):
- **MAJOR**: breaking changes
- **MINOR**: новый функционал (обратно совместимый)
- **PATCH**: исправления багов

Текущая версия: **0.1.0** (MVP фаза)

## Будущие технологии (roadmap)

### Планируется добавить:

1. **Testing**
   - Jest - unit тесты
   - React Testing Library - компоненты
   - Playwright - E2E тесты

2. **Monitoring**
   - Sentry - error tracking
   - Google Analytics - аналитика
   - Vercel Analytics - performance

3. **Authentication**
   - OAuth Google
   - OAuth Apple
   - OAuth VK

4. **Features**
   - PWA support
   - Offline mode
   - Push notifications

5. **Performance**
   - React Query - advanced caching
   - Service Worker - offline support
   - Web Vitals optimization

---

*Стек технологий актуализирован: октябрь 2025*

