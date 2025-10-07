# 🧩 Компоненты приложения

## Обзор

Документация описывает все UI компоненты приложения, их назначение, props и примеры использования.

---

## 🎨 UI Components (базовые)

Переиспользуемые базовые компоненты для построения интерфейса.

### Button

Кнопка с различными вариантами стилей.

**Расположение**: `src/components/ui/Button/Button.tsx`

#### Props:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}
```

#### Варианты:

- **primary**: основная кнопка (синий фон)
- **secondary**: второстепенная (серый фон)
- **outline**: только обводка
- **ghost**: прозрачная (видна при hover)
- **danger**: опасное действие (красный)

#### Размеры:

- **small**: компактная кнопка
- **medium**: стандартная (по умолчанию)
- **large**: большая кнопка

#### Примеры использования:

```typescript
import { Button } from '@/components/ui';

// Основная кнопка
<Button variant="primary" size="large">
  Создать сказку
</Button>

// Кнопка с иконкой
<Button variant="outline" size="small">
  <Plus className="w-4 h-4" />
  Добавить
</Button>

// Опасное действие
<Button variant="danger" onClick={handleDelete}>
  Удалить
</Button>
```

---

### Input

Поле ввода текста.

**Расположение**: `src/components/ui/Input/Input.tsx`

#### Props:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

#### Примеры:

```typescript
import { Input } from '@/components/ui';

// С лейблом
<Input 
  label="Название сказки"
  placeholder="Введите название..."
  value={title}
  onChange={e => setTitle(e.target.value)}
/>

// С ошибкой
<Input 
  label="Email"
  type="email"
  error="Некорректный email"
/>

// С подсказкой
<Input 
  label="Возраст"
  helperText="От 0 до 5 лет"
/>
```

---

### Modal

Модальное окно.

**Расположение**: `src/components/ui/Modal/Modal.tsx`

#### Props:

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

#### Примеры:

```typescript
import { Modal } from '@/components/ui';

<Modal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  title="Создание сказки"
  size="large"
>
  <form>
    {/* Содержимое модалки */}
  </form>
</Modal>
```

---

### Pagination

Компонент пагинации.

**Расположение**: `src/components/ui/Pagination/Pagination.tsx`

#### Props:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}
```

#### Примеры:

```typescript
import { Pagination } from '@/components/ui';

<Pagination
  currentPage={3}
  totalPages={10}
  hasNextPage={true}
  hasPreviousPage={true}
  onPageChange={setPage}
/>
```

#### Возможности:

- Кнопки "Предыдущая" / "Следующая"
- Отображение текущей страницы
- Автоматическое отключение кнопок на границах
- Адаптивный дизайн

---

### Select

Выпадающий список.

**Расположение**: `src/components/ui/Select/Select.tsx`

#### Props:

```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}
```

#### Примеры:

```typescript
import { Select } from '@/components/ui';

<Select
  label="Категория"
  options={[
    { value: 'bedtime', label: 'Убаюкивающие' },
    { value: 'educational', label: 'Обучающие' },
    { value: 'adventure', label: 'Приключения' }
  ]}
  value={category}
  onChange={e => setCategory(e.target.value)}
/>
```

---

### BackButton

Кнопка "Назад" для навигации.

**Расположение**: `src/components/ui/BackButton/BackButton.tsx`

#### Props:

```typescript
interface BackButtonProps {
  href?: string;  // Если не указан, использует router.back()
  label?: string; // По умолчанию "Назад"
}
```

#### Примеры:

```typescript
import { BackButton } from '@/components/ui';

// Навигация назад в истории
<BackButton />

// Навигация на конкретную страницу
<BackButton href="/stories" label="К библиотеке" />
```

---

## 🔐 Auth Components (аутентификация)

Компоненты для работы с аутентификацией.

### AuthButton

Кнопка входа/выхода с отображением пользователя.

**Расположение**: `src/components/auth/AuthButton/AuthButton.tsx`

#### Функционал:

- **Неавторизованный**: показывает кнопку "Войти"
- **Авторизованный**: показывает аватар и имя, меню с профилем и выходом

#### Примеры:

```typescript
import AuthButton from '@/components/auth/AuthButton/AuthButton';

// В Header
<AuthButton />
```

#### Состояния:

1. **Не авторизован**:
   - Кнопка "Войти"
   - Клик открывает AuthModal

2. **Авторизован**:
   - Аватар пользователя
   - Dropdown меню:
     - Перейти в профиль
     - Выйти

---

### AuthModal

Модальное окно для регистрации/входа.

**Расположение**: `src/components/auth/AuthModal/AuthModal.tsx`

#### Props:

```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

#### Функционал:

- **Tabs**: Вход / Регистрация
- **Форма входа**:
  - Email
  - Пароль
  - Кнопка "Войти"
- **Форма регистрации**:
  - Email
  - Пароль
  - Имя пользователя
  - Кнопка "Зарегистрироваться"
- **Валидация**: через react-hook-form + zod
- **Ошибки**: отображение ошибок от Supabase

#### Примеры:

```typescript
import AuthModal from '@/components/auth/AuthModal/AuthModal';

<AuthModal 
  isOpen={isAuthModalOpen} 
  onClose={() => setAuthModalOpen(false)} 
/>
```

---

### AuthProvider

Context Provider для аутентификации.

**Расположение**: `src/components/auth/AuthProvider/AuthProvider.tsx`

#### Функционал:

- Слушает изменения auth состояния через Supabase
- Автоматически обновляет Redux store
- Получает роль пользователя (is_moderator)

#### Использование:

```typescript
// В app/layout.tsx
import AuthProvider from '@/components/auth/AuthProvider/AuthProvider';

<AuthProvider>
  {children}
</AuthProvider>
```

---

## 📚 Story Components (сказки)

Компоненты для работы со сказками.

### StoryCard

Карточка сказки в списке.

**Расположение**: `src/components/story/StoryCard/StoryCard.tsx`

#### Props:

```typescript
interface StoryCardProps {
  story: StoryCardData;
  onDelete?: (id: string) => void;
  showDeleteButton?: boolean;
}

interface StoryCardData {
  id: string;
  title: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  readTime: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Отображает:

- Обложку сказки (или заглушку)
- Название сказки
- Отрывок текста (первые 150 символов)
- Автора (аватар + имя)
- Время чтения
- Дату создания
- Кнопку удаления (для модераторов)

#### Примеры:

```typescript
import StoryCard from '@/components/story/StoryCard/StoryCard';

<StoryCard
  story={{
    id: '123',
    title: 'Волшебный лес',
    excerpt: 'Жила-была маленькая девочка...',
    author: {
      id: 'author-1',
      username: 'Сказочник',
      avatar_url: '/avatars/1.jpg'
    },
    readTime: '10 мин',
    coverImage: '/covers/forest.jpg',
    createdAt: '2025-10-01',
    updatedAt: '2025-10-01'
  }}
  showDeleteButton={user?.is_moderator}
  onDelete={handleDelete}
/>
```

#### Интерактивность:

- **Клик на карточку**: переход на страницу сказки
- **Клик на автора**: переход в профиль автора
- **Hover эффекты**: анимация появления

---

### RichTextEditor

WYSIWYG редактор для создания сказок.

**Расположение**: `src/components/story/RichTextEditor/RichTextEditor.tsx`

#### Props:

```typescript
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
}
```

#### Возможности:

**Форматирование:**
- **Жирный текст** (Ctrl+B)
- *Курсив* (Ctrl+I)
- Подчеркивание (Ctrl+U)
- ~~Зачеркивание~~

**Заголовки:**
- H1 - главный заголовок
- H2 - подзаголовок
- H3 - подзаголовок уровня 3

**Списки:**
- Маркированный список
- Нумерованный список

**Дополнительно:**
- Цитаты
- Ссылки
- Изображения
- Цвет текста
- Горизонтальная линия

**Утилиты:**
- Отмена/Повтор (Ctrl+Z / Ctrl+Shift+Z)
- Счетчик символов
- Лимит символов

#### Примеры:

```typescript
import RichTextEditor from '@/components/story/RichTextEditor/RichTextEditor';

<RichTextEditor
  content={storyContent}
  onChange={setStoryContent}
  placeholder="Начните писать сказку..."
  maxLength={50000}
/>
```

#### Toolbar разделы:

```
[Undo|Redo] | [H1|H2|H3] | [B|I|U|S] | [Quote|Link|Image] | [List|OrderedList] | [Color] | [Characters: 0/50000]
```

---

## 📝 Modal Components (модальные окна)

### CreateStoryModal

Модальное окно создания сказки.

**Расположение**: `src/components/modals/CreateStoryModal/CreateStoryModal.tsx`

#### Props:

```typescript
interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoryFormData & { cover_image?: File }) => void;
}

interface CreateStoryFormData {
  title: string;
  content: string;
  is_published: boolean;
}
```

#### Поля формы:

1. **Название** (обязательно)
   - Input текстовое поле
   - Валидация: не пустое, макс 200 символов

2. **Содержание** (обязательно)
   - RichTextEditor
   - Валидация: не пустое, макс 50000 символов

3. **Обложка** (опционально)
   - File upload
   - Форматы: JPG, PNG, WEBP
   - Макс размер: 5MB
   - Preview перед загрузкой

4. **Статус публикации**
   - Checkbox "Опубликовать сразу"
   - По умолчанию: true

#### Валидация:

```typescript
const schema = z.object({
  title: z.string()
    .min(1, 'Название обязательно')
    .max(200, 'Максимум 200 символов'),
  content: z.string()
    .min(1, 'Содержание обязательно')
    .max(50000, 'Максимум 50000 символов'),
  is_published: z.boolean(),
  cover_image: z
    .instanceof(File)
    .optional()
    .refine(
      file => !file || file.size <= 5 * 1024 * 1024,
      'Максимальный размер файла 5MB'
    )
});
```

#### Примеры:

```typescript
import CreateStoryModal from '@/components/modals/CreateStoryModal/CreateStoryModal';

<CreateStoryModal
  isOpen={isCreateModalOpen}
  onClose={() => setCreateModalOpen(false)}
  onSubmit={handleCreateStory}
/>
```

---

## 🎯 Layout Components (структура)

Компоненты структуры приложения.

### Header

Шапка сайта.

**Расположение**: `src/components/layout/Header/Header.tsx`

#### Props:

```typescript
interface HeaderProps {
  magic?: boolean; // Специальный эффект (необязательно)
}
```

#### Содержит:

- **Логотип**: ссылка на главную (иконка книги)
- **Навигация**:
  - Кнопка "О нас" → `/about`
  - Кнопка "Библиотека" → `/stories`
- **AuthButton**: вход/профиль

#### Структура:

```
┌─────────────────────────────────────────┐
│ [📖 Logo]         [About] [Library] [👤] │
└─────────────────────────────────────────┘
```

#### Примеры:

```typescript
import Header from '@/components/layout/Header/Header';

// Обычный header
<Header />

// С магическим эффектом
<Header magic={true} />
```

---

### Footer

Подвал сайта.

**Расположение**: `src/components/layout/Footer/Footer.tsx`

#### Содержит:

- Информация о создателе
- Ссылка на Telegram
- Копирайт

#### Структура:

```
┌─────────────────────────────────────────┐
│   Сделано M1, с ❤️ и багами            │
└─────────────────────────────────────────┘
```

#### Примеры:

```typescript
import Footer from '@/components/layout/Footer/Footer';

<Footer />
```

---

## 🎨 Стилизация компонентов

### CSS Modules

Каждый компонент имеет свой CSS Module файл:

```
Button/
├── Button.tsx
└── Button.module.css
```

### Использование:

```typescript
import styles from './Button.module.css';

<button className={styles.button}>
  Click me
</button>
```

### Комбинирование классов:

```typescript
import clsx from 'clsx';
import styles from './Button.module.css';

<button className={clsx(
  styles.button,
  styles[variant],
  styles[size],
  className
)}>
  {children}
</button>
```

---

## 📱 Адаптивность

Все компоненты адаптивны и работают на:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

### Breakpoints:

```css
/* Mobile first подход */
.component {
  /* Mobile styles */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

---

*Документация компонентов актуализирована: октябрь 2025*

