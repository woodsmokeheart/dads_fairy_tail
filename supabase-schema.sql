-- Схема базы данных 
-- Создание таблиц и настройка безопасности

-- Включение расширений
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание таблицы профилей пользователей (расширение auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_moderator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание таблицы сказок
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- JSON контент от Tiptap
  content_text TEXT NOT NULL, -- Чистый текст для поиска
  cover_image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);




-- Создание индексов для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS idx_stories_is_published ON stories(is_published);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at);
CREATE INDEX IF NOT EXISTS idx_stories_views_count ON stories(views_count);


-- Создание функции для получения статистики пользователя
CREATE OR REPLACE FUNCTION get_user_stats(target_user_id UUID)
RETURNS TABLE(
    user_id UUID,
    username TEXT,
    avatar_url TEXT,
    is_moderator BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    stories_created BIGINT,
    stories_published BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as user_id,
        p.username,
        p.avatar_url,
        p.is_moderator,
        p.created_at,
        COUNT(s.id) as stories_created,
        COUNT(CASE WHEN s.is_published = true THEN 1 END) as stories_published
    FROM profiles p
    LEFT JOIN stories s ON s.author_id = p.id
    WHERE p.id = target_user_id
    GROUP BY p.id, p.username, p.avatar_url, p.is_moderator, p.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Включение Row Level Security для всех таблиц
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Политики безопасности для таблицы profiles
CREATE POLICY "Пользователи могут читать все профили" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Пользователи могут обновлять только свой профиль" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Пользователи могут создавать только свой профиль" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Политики безопасности для таблицы stories
CREATE POLICY "Все пользователи могут читать опубликованные сказки" ON stories
    FOR SELECT USING (is_published = true OR auth.uid() = author_id);

CREATE POLICY "Авторы могут создавать сказки" ON stories
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Авторы могут обновлять свои сказки" ON stories
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Авторы могут удалять свои сказки" ON stories
    FOR DELETE USING (auth.uid() = author_id);



-- Создание триггеров для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
    BEFORE UPDATE ON stories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();



-- Создание функции для поиска по сказкам
CREATE OR REPLACE FUNCTION search_stories(search_query TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
    id UUID,
    title TEXT,
    content_text TEXT,
    author_id UUID,
    is_published BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.content_text,
        s.author_id,
        s.is_published,
        s.created_at,
        ts_rank(to_tsvector('russian', s.title || ' ' || s.content_text), plainto_tsquery('russian', search_query)) as rank
    FROM stories s
    WHERE s.is_published = true
        AND to_tsvector('russian', s.title || ' ' || s.content_text) @@ plainto_tsquery('russian', search_query)
    ORDER BY rank DESC, s.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Добавление комментариев к таблицам
COMMENT ON TABLE profiles IS 'Профили пользователей';
COMMENT ON TABLE stories IS 'Сказки и истории';

-- Добавление комментариев к функциям
COMMENT ON FUNCTION get_user_stats(UUID) IS 'Получение статистики пользователя';
COMMENT ON FUNCTION search_stories(TEXT, INTEGER) IS 'Поиск сказок по тексту';
