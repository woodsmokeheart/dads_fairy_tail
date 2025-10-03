'use client';

import React, { useEffect, useState } from 'react';
import { 
  User, 
  BookOpen, 
  Plus,
  Star
} from 'lucide-react';
import { Button, Pagination } from '@/components/ui';
import Image from 'next/image';
import CreateStoryModal from '@/components/modals/CreateStoryModal/CreateStoryModal';
import type { CreateStoryFormData } from '@/components/modals/CreateStoryModal/CreateStoryModal';
import type { Story, AuthUser, PaginatedStoriesResponse } from '@/types';
import { supabase } from '@/lib/supabase';
import { StoriesService } from '@/services';
import { getUserWithModeratorStatus } from '@/lib/auth';
import { getReadingTime } from '@/lib/readingTime';
import StoryCard from '@/components/story/StoryCard/StoryCard';
import type { StoryCardData } from '@/components/story/StoryCard/StoryCard';
import { useStories, useAuth, useUI } from '~/hooks';
import { inject } from '~/libs/di';
import styles from './page.module.css';

export default function ProfilePage() {
  const { user, setUser, setLoading, setError } = useAuth();
  const { stories, setStories, removeStory } = useStories();
  const { isCreateStoryModalOpen, setCreateStoryModalOpen, showToast } = useUI();
  
  const logger = inject('logger');
  const storiesService = StoriesService.getInstance();

  const [paginationData, setPaginationData] = useState<PaginatedStoriesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          setUser(null);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          let storiesCount = 0;

          try {
            if (profile.is_moderator) {
              const userStories = await storiesService.getUserStories(profile.id);
              storiesCount = userStories.length;
            }
          } catch (error) {
            logger.error('Ошибка загрузки статистики:', error);
          }

          const userProfile: AuthUser = {
            id: profile.id,
            email: authUser.email || '',
            is_moderator: profile.is_moderator || false,
            user_metadata: {
              username: profile.username,
              avatar_url: profile.avatar_url || undefined,
            created_at: profile.created_at,
            stats: {
                stories_created: storiesCount,
                stories_published: 0, 
              },
            },
          };
          setUser(userProfile);
        }
      } catch (error) {
        logger.error('Ошибка загрузки данных пользователя:', error);
        setError('Ошибка загрузки данных пользователя');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [setUser, setLoading, setError, logger, storiesService]);

  useEffect(() => {
    const loadUserStories = async () => {
      if (!user || !user.is_moderator) return;

      try {
        const paginatedResponse = await storiesService.getStoriesPaginated(
          { author_id: user.id },
          { page: currentPage, limit: 6 }
        );
        
        setPaginationData(paginatedResponse);
        setStories(paginatedResponse.stories);
        
        logger.debug('User stories loaded:', {
          stories: paginatedResponse.stories.length,
          currentPage: paginatedResponse.currentPage,
          totalPages: paginatedResponse.totalPages
        });
      } catch (error) {
        logger.error('Ошибка загрузки сказок пользователя:', error);
        setError('Ошибка загрузки сказок пользователя');
      }
    };

    loadUserStories();
  }, [user, setStories, setError, logger, storiesService, currentPage]);

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

  const handleCreateStory = async (data: CreateStoryFormData & { cover_image?: File }) => {
    if (!user) return;
    
    logger.debug('Начинаем создание сказки:', data.title);
    
    try {
      const newStory = await storiesService.createStory({
        title: data.title,
        content: data.content,
        cover_image: data.cover_image,
        is_published: data.is_published,
      });
      
      logger.debug('Сказка создана успешно:', newStory.id);

      const executionQueue = inject('executionQueue');
      executionQueue.clearCacheByPattern(['stories', 'paginated']);
      
      if (data.is_published) {
        executionQueue.clearCacheByPattern(['stories', 'paginated']);
      }
      
      logger.debug('Перезагружаем данные с сервера...');
      
      const paginatedResponse = await storiesService.getStoriesPaginated(
        { author_id: user.id },
        { page: 1, limit: 6 }
      );
      
      setPaginationData(paginatedResponse);
      setStories(paginatedResponse.stories);
      setCurrentPage(1); 
      
      logger.debug('Данные перезагружены с сервера');

      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const userWithModerator = await getUserWithModeratorStatus(authUser as unknown as Record<string, unknown>);
          setUser(userWithModerator);
        }
      } catch (error) {
        logger.error('Ошибка обновления данных пользователя:', error);
      }

      logger.debug('Сказка успешно создана и обработана');
      showToast('Сказка успешно создана!', 'success');
      setCreateStoryModalOpen(false);
    } catch (error) {
      logger.error('Ошибка создания сказки:', error);
      showToast('Ошибка создания сказки', 'error');
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!user) return;
    
    if (confirm('Вы уверены, что хотите удалить эту сказку? Это действие нельзя отменить.')) {
      try {
        await storiesService.deleteStory(storyId);
        
        removeStory(storyId);
        
        const executionQueue = inject('executionQueue');
        executionQueue.clearCacheByPattern(['stories', 'paginated']);
        
        executionQueue.clearCacheByPattern(['stories', 'paginated']);
        
        let targetPage = currentPage;
        let paginatedResponse = await storiesService.getStoriesPaginated(
          { author_id: user.id },
          { page: currentPage, limit: 6 }
        );
        
        if (paginatedResponse.stories.length === 0 && currentPage > 1) {
          targetPage = currentPage - 1;
          paginatedResponse = await storiesService.getStoriesPaginated(
            { author_id: user.id },
            { page: targetPage, limit: 6 }
          );
          
          if (paginatedResponse.stories.length === 0 && targetPage > 1) {
            targetPage = 1;
            paginatedResponse = await storiesService.getStoriesPaginated(
              { author_id: user.id },
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

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.user_metadata.avatar_url ? (
              <Image 
                src={user.user_metadata.avatar_url} 
                alt={user.user_metadata.username || 'Avatar'} 
                width={64}
                height={64}
                className={styles.avatarImage}
              />
            ) : (
            <User className={styles.avatarIcon} />
            )}
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.username}>{user.user_metadata.username}</h1>
            <p className={styles.email}>{user.email}</p>
          {user.is_moderator && (
              <span className={styles.moderatorBadge}>
                <Star className={styles.starIcon} />
                Модератор
              </span>
          )}
        </div>
      </div>

      <div className={styles.stats}>
          {user.is_moderator && (
            <div className={styles.statItem}>
              <BookOpen className={styles.statIcon} />
              <div>
                <span className={styles.statNumber}>{user.user_metadata.stats?.stories_created || 0}</span>
                <span className={styles.statLabel}>Сказок создано</span>
              </div>
            </div>
          )}
          
          {user.is_moderator && (
            <div className={styles.createButtonContainer}>
              <Button
                onClick={() => setCreateStoryModalOpen(true)}
                className={styles.createButton}
              >
                <Plus className={styles.buttonIcon} />
                Создать сказку
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {user.is_moderator && (
          <div className={styles.tabContent}>
            <h2 className={styles.sectionTitle}>Мои сказки</h2>
            {stories.length > 0 ? (
              <>
                <div className={styles.storiesGrid}>
                  {stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      story={formatStoryToCard(story)}
                      onDelete={() => handleDeleteStory(story.id)}
                      showDeleteButton={true}
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
                <p>У вас пока нет сказок</p>
                <Button
                  onClick={() => setCreateStoryModalOpen(true)}
                  variant="outline"
                  size="small"
                >
                  Создать первую сказку
                </Button>
              </div>
            )}
          </div>
        )}

      </div>

        <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setCreateStoryModalOpen(false)}
          onSubmit={handleCreateStory}
        />
    </div>
  );
}