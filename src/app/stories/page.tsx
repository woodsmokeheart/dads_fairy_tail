import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Library, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { getReadingTime } from '@/lib/readingTime';
import StoryCard from '@/components/story/StoryCard/StoryCard';
import type { StoryCardData } from '@/components/story/StoryCard/StoryCard';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

interface Story {
  id: string;
  title: string;
  content: string;
  content_text: string;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
    avatar_url?: string | null;
  };
}

interface PaginatedStoriesResponse {
  stories: Story[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const metadata: Metadata = {
  title: 'Библиотека сказок - Папины сказки',
  description: 'Все опубликованные сказки в нашей библиотеке. Читайте волшебные истории для детей и наслаждайтесь авторскими произведениями.',
  keywords: 'библиотека сказок, все сказки, детские истории, авторские сказки, волшебные истории',
  alternates: {
    canonical: 'https://dads-fairy-tales.vercel.app/stories'
  },
  openGraph: {
    title: 'Библиотека сказок - Папины сказки',
    description: 'Все опубликованные сказки в нашей библиотеке. Читайте волшебные истории для детей и наслаждайтесь авторскими произведениями.',
    type: 'website',
  },
};

async function getStoriesPaginated(
  page: number = 1,
  limit: number = 12
): Promise<PaginatedStoriesResponse> {
  try {
    const offset = (page - 1) * limit;

    const { count: totalCount } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles!stories_author_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Ошибка загрузки сказок: ${error.message}`);
    }

    const totalPages = Math.ceil((totalCount || 0) / limit);

    return {
      stories: stories || [],
      currentPage: page,
      totalPages,
      totalCount: totalCount || 0,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error('Error fetching stories:', error);
    return {
      stories: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}

function formatStoryToCard(story: Story): StoryCardData {
  return {
    id: story.id,
    title: story.title,
    excerpt: story.content_text.substring(0, 150) + '...',
    author: {
      id: story.author?.id || 'unknown',
      username: story.author?.username || 'Неизвестный автор',
      avatar_url: story.author?.avatar_url || undefined,
    },
    readTime: getReadingTime(story.content),
    coverImage: story.cover_image_url || undefined,
    createdAt: story.created_at,
    updatedAt: story.updated_at,
  };
}

interface StoriesPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function StoriesPage({ searchParams }: StoriesPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const storiesData = await getStoriesPaginated(currentPage, 6);

  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerIcon}>
            <Library className={styles.libraryIcon} />
          </div>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Библиотека сказок</h1>
            <p className={styles.description}>
              Все опубликованные сказки в нашей коллекции. 
              Найдите свою любимую историю или откройте что-то новое!
            </p>
            {storiesData.totalCount > 0 && (
              <p className={styles.count}>
                Всего сказок: {storiesData.totalCount}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className={styles.storiesSection}>
        {storiesData.stories.length > 0 ? (
          <>
            <div className={styles.storiesGrid}>
              {storiesData.stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={formatStoryToCard(story)}
                  showDeleteButton={false}
                />
              ))}
            </div>
            
            {storiesData.totalPages > 1 && (
              <div className={styles.paginationWrapper}>
                <div className={styles.pagination}>
                  {storiesData.hasPreviousPage && (
                    <Link 
                      href={storiesData.currentPage === 2 ? '/stories' : `/stories?page=${storiesData.currentPage - 1}`}
                      className={styles.paginationButton}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Предыдущая
                    </Link>
                  )}
                  
                  <span className={styles.paginationInfo}>
                    Страница {storiesData.currentPage} из {storiesData.totalPages}
                  </span>
                  
                  {storiesData.hasNextPage && (
                    <Link 
                      href={`/stories?page=${storiesData.currentPage + 1}`}
                      className={styles.paginationButton}
                    >
                      Следующая
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen className={styles.emptyIcon} />
            <h2>Пока нет сказок</h2>
            <p>Библиотека пуста, но скоро здесь появятся волшебные истории!</p>
            <Link href="/">
              <Button variant="primary" size="large">
                Вернуться на главную
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
