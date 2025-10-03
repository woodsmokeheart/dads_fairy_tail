'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button, Pagination } from '@/components/ui';
import { getReadingTime } from '@/lib/readingTime';
import { supabase } from '@/lib/supabase';
import { getUserWithModeratorStatus } from '@/lib/auth';
import type { Story, PaginatedStoriesResponse } from '@/types';
import StoryCard from '@/components/story/StoryCard/StoryCard';
import type { StoryCardData } from '@/components/story/StoryCard/StoryCard';
import { useStories, useAuth, useUI } from '~/hooks';
import { inject } from '~/libs/di';
import styles from './page.module.css';

export default function HomePage() {
  const { user, setUser } = useAuth();
  const { stories, setStories, setLoading: setStoriesLoading, setError: setStoriesError, removeStory } = useStories();
  const { showToast } = useUI();
  
  const logger = inject('logger');
  const storiesService = inject('storiesService');

  const [paginationData, setPaginationData] = useState<PaginatedStoriesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPopularStories = async () => {
      try {
        setStoriesLoading(true);
        setStoriesError(null);
        
        const paginatedResponse = await storiesService.getStoriesPaginated(
          { is_published: true },
          { page: currentPage, limit: 6 }
        );
        
        setPaginationData(paginatedResponse);
        setStories(paginatedResponse.stories);
        
        logger.info('Популярные сказки загружены:', {
          stories: paginatedResponse.stories.length,
          currentPage: paginatedResponse.currentPage,
          totalPages: paginatedResponse.totalPages
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        setStoriesError(errorMessage);
        logger.error('Ошибка загрузки популярных сказок:', error);
        showToast('Ошибка загрузки сказок', 'error');
      } finally {
        setStoriesLoading(false);
      }
    };

    loadPopularStories();
  }, [setStories, setStoriesLoading, setStoriesError, logger, showToast, storiesService, currentPage]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const userWithModerator = await getUserWithModeratorStatus(authUser as unknown as Record<string, unknown>);
          setUser(userWithModerator);
        } else {
          setUser(null);
        }
      } catch (error) {
        logger.error('Ошибка загрузки пользователя:', error);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const authUser = session?.user;
        if (authUser) {
          const userWithModerator = await getUserWithModeratorStatus(authUser as unknown as Record<string, unknown>);
          setUser(userWithModerator);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, logger]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!user || !user.is_moderator) return;
    
    if (confirm('Вы уверены, что хотите удалить эту сказку? Это действие нельзя отменить.')) {
      try {
        
        await storiesService.deleteStory(storyId);
        
        removeStory(storyId);
        
        const executionQueue = inject('executionQueue');
        executionQueue.clearCacheByPattern(['stories', 'paginated']);
        
        if (user) {
          executionQueue.clearCacheByPattern(['stories', 'paginated']);
        }
        
        let targetPage = currentPage;
        let paginatedResponse = await storiesService.getStoriesPaginated(
          { is_published: true },
          { page: currentPage, limit: 6 }
        );
        
        if (paginatedResponse.stories.length === 0 && currentPage > 1) {
          targetPage = currentPage - 1;
          paginatedResponse = await storiesService.getStoriesPaginated(
            { is_published: true },
            { page: targetPage, limit: 6 }
          );
          
          if (paginatedResponse.stories.length === 0 && targetPage > 1) {
            targetPage = 1;
            paginatedResponse = await storiesService.getStoriesPaginated(
              { is_published: true },
              { page: targetPage, limit: 6 }
            );
          }
        }
        
        setPaginationData(paginatedResponse);
        setStories(paginatedResponse.stories);
        setCurrentPage(targetPage);
        
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            const userWithModerator = await getUserWithModeratorStatus(authUser as unknown as Record<string, unknown>);
            setUser(userWithModerator);
          }
        } catch (error) {
          logger.error('Ошибка обновления данных пользователя:', error);
        }
        
        showToast('Сказка успешно удалена', 'success');
      } catch (error) {
        logger.error('Ошибка удаления сказки:', error);
        showToast('Ошибка удаления сказки', 'error');
      }
    }
  };

  const formatStoryToCard = (story: Story): StoryCardData => ({
    id: story.id,
    title: story.title,
    excerpt: story.content_text.substring(0, 150) + '...',
    author: {
      id: story.author?.id || '',
      username: story.author?.username || 'Неизвестно',
      avatar_url: story.author?.avatar_url || undefined,
    },
    readTime: getReadingTime(story.content),
    coverImage: story.cover_image_url || undefined,
    createdAt: story.created_at,
    updatedAt: story.updated_at,
  });

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <div>Волшебные сказки для ваших</div>
            <div className={styles.heroTitleAccent}>маленьких принцев и принцесс</div>
          </h1>
          <p className={styles.heroDescription}>
            Авторские истории специально для малышей до 5 лет! 
            Каждая сказка создана с любовью и заботой, чтобы подарить вашему ребёнку 
            незабываемые моменты перед сном.
          </p>
        </div>
        <div className={styles.backgroundBook}>
          <BookOpen className={styles.bookIcon} />
        </div>
      </section>

      <section className={styles.popularStories}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Популярные сказки
          </h2>
          <p className={styles.sectionDescription}>
            Самые любимые истории наших читателей
          </p>
        </div>

        {stories.length > 0 ? (
          <>
            <div className={styles.storiesGrid}>
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={formatStoryToCard(story)}
                  onDelete={handleDeleteStory}
                  showDeleteButton={user?.is_moderator}
                />
              ))}
            </div>
            
            {paginationData && paginationData.totalPages > 1 && (
              <Pagination
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                hasNextPage={paginationData.hasNextPage}
                hasPreviousPage={paginationData.hasPreviousPage}
                onPageChange={handlePageChange}
                className={styles.pagination}
              />
            )}
          </>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen className={styles.emptyIcon} />
            <h3>Пока нет сказок</h3>
            <p>Будьте первым, кто создаст волшебную историю!</p>
            <Button
              variant="primary"
              size="large"
              onClick={() => {
                showToast('Свяжитесь с администратором для получения прав автора', 'info');
              }}
            >
              <Sparkles className={styles.buttonIcon} />
              Стать автором
            </Button>
          </div>
        )}
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>
            Хотите стать автором?
          </h2>
          <p className={styles.ctaDescription}>
            Получите права автора и создавайте удивительные сказки для наших читателей
          </p>
          <Button
            variant="primary"
            size="large"
            onClick={() => {
              showToast('Свяжитесь с администратором для получения прав автора', 'info');
            }}
          >
            <Sparkles className={styles.buttonIcon} />
            Стать автором
          </Button>
        </div>
      </section>
    </div>
  );
}