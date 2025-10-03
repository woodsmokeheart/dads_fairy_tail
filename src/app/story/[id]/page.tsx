import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { 
  Clock, 
  Calendar
} from 'lucide-react';
import BackButton from '@/components/ui/BackButton/BackButton';
import { supabase } from '@/lib/supabase';
import { getReadingTime } from '@/lib/readingTime';
import styles from './page.module.css';

interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  readTime: string;
  createdAt: string;
  updatedAt: string;
  coverImage?: string;
}

interface StoryPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const story = await getStory(resolvedParams.id);
  
  if (!story) {
    return {
      title: 'Сказка не найдена',
    };
  }

  return {
    title: `${story.title} - Папины сказки`,
    description: story.excerpt,
    keywords: story.title,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: 'article',
      publishedTime: story.createdAt,
      authors: [story.author.username],
    },
  };
}

async function getStory(id: string): Promise<Story | null> {
  try {
    const { data: story, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles!stories_author_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (error || !story) {
      return null;
    }

    const contentHTML = convertTiptapToHTML(story.content);
    
    const readTime = getReadingTime(story.content);

    return {
      id: story.id,
      title: story.title,
      content: contentHTML,
      excerpt: story.content_text.substring(0, 90) + '...',
      author: {
        id: story.profiles.id,
        username: story.profiles.username,
        avatar_url: story.profiles.avatar_url || undefined,
      },
      readTime: readTime,
      createdAt: story.created_at,
      updatedAt: story.updated_at,
      coverImage: story.cover_image_url || undefined,
    };
  } catch (error) {
    console.error('Error fetching story:', error);
    return null;
  }
}

function convertTiptapToHTML(jsonContent: string): string {
  try {
    const content = JSON.parse(jsonContent);
    return processNode(content);
  } catch {
    return jsonContent;
  }
}

function processNode(node: Record<string, unknown>): string {
  if (typeof node.text === 'string') {
    let text = node.text;
    
    if (Array.isArray(node.marks)) {
      for (const mark of node.marks as Array<Record<string, unknown>>) {
        if (mark.type === 'bold') text = `<strong>${text}</strong>`;
        if (mark.type === 'italic') text = `<em>${text}</em>`;
        if (mark.type === 'strike') text = `<s>${text}</s>`;
      }
    }
    
    return text;
  }

  if (Array.isArray(node.content)) {
    const children = node.content.map((child: unknown) => processNode(child as Record<string, unknown>)).join('');
    
    switch (node.type) {
      case 'paragraph':
        return `<p>${children}</p>`;
      case 'heading':
        const level = (node.attrs as Record<string, unknown>)?.level || 1;
        return `<h${level}>${children}</h${level}>`;
      case 'bulletList':
        return `<ul>${children}</ul>`;
      case 'orderedList':
        return `<ol>${children}</ol>`;
      case 'listItem':
        return `<li>${children}</li>`;
      case 'blockquote':
        return `<blockquote>${children}</blockquote>`;
      default:
        return children;
    }
  }

  return '';
}

export async function generateStaticParams() {
  try {
    const { data: stories, error } = await supabase
      .from('stories')
      .select('id')
      .eq('is_published', true)
      .limit(100); 
    if (error) {
      console.error('Error fetching stories for static params:', error);
      return [{ id: '1' }]; 
    }

    return stories?.map((story) => ({
      id: story.id,
    })) || [{ id: '1' }];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [{ id: '1' }];
  }
}

export const revalidate = 3600;

export default async function StoryPage({ params }: StoryPageProps) {
  const resolvedParams = await params;
  const story = await getStory(resolvedParams.id);

  if (!story) {
    notFound();
  }

  return (
    <div className={styles.container}>

      {story.coverImage && (
        <div className={styles.coverImageContainer}>
          <Image 
            src={story.coverImage} 
            alt={story.title}
            width={1200}
            height={250}
            className={styles.coverImage}
            priority
          />
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{story.title}</h1>
          <p className={styles.excerpt}>{story.excerpt}</p>
          
          <div className={styles.meta}>
            <div className={styles.readTime}>
              <Clock className="w-4 h-4" />
              <span>{story.readTime}</span>
            </div>
            <div className={styles.date}>
              <Calendar className="w-4 h-4" />
              <span>{new Date(story.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
          
          <div className={styles.backButton}>
            <BackButton />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <div 
            className={styles.storyContent}
            dangerouslySetInnerHTML={{ __html: story.content }}
          />
        </div>
      </div>
    </div>
  );
}
