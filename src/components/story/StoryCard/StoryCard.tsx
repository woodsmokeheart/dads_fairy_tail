'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, 
  Trash2,
  BookOpen,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './StoryCard.module.css';

export interface StoryCardData {
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

interface StoryCardProps {
  story: StoryCardData;
  isModerator?: boolean;
  isAuthenticated?: boolean;
  onEdit?: (storyId: string) => void;
  onDelete?: (storyId: string) => void;
  showDeleteButton?: boolean;
}

export default function StoryCard({
  story,
  onDelete,
  showDeleteButton = false,
}: StoryCardProps) {

  const handleDelete = () => {
    if (onDelete) {
      onDelete(story.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.coverContainer}>
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className={styles.coverImage}
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <BookOpen className={styles.coverIcon} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link href={`/story/${story.id}`}>
            {story.title}
          </Link>
        </h3>

        <p className={styles.excerpt}>
          {story.excerpt}
        </p>

        <div className={styles.actions}>
          <div className={styles.metadataGroup}>
            <div className={styles.actionItem}>
              <Clock className={styles.actionIcon} />
              <span className={styles.actionText}>{story.readTime}</span>
            </div>

          </div>

          <div className={styles.actionsGroup}>
            {showDeleteButton && onDelete && (
              <Button
                variant="danger"
                size="small"
                onClick={handleDelete}
                className={styles.modActionButton}
                title="Удалить сказку"
              >
                <Trash2 className={styles.buttonIcon} />
              </Button>
            )}


            <Link href={`/story/${story.id}`}>
              <Button
                variant="primary"
                size="small"
                className={styles.readButton}
                title="Читать сказку"
              >
                <Play className={styles.buttonIcon} />
                Читать
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
