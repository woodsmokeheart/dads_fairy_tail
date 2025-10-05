import { supabase } from './supabase';
import type { AuthUser } from '@/types';


export async function isModerator(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_moderator')
      .eq('id', userId)
      .single();

    return profile?.is_moderator || false;
  } catch (error) {
    console.error('Error checking moderator status:', error);
    return false;
  }
}


export async function getUserStats(userId: string): Promise<{ stories_created: number; stories_published: number }> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('id, is_published')
      .eq('author_id', userId);

    if (error) {
      console.error('Error getting user stats:', error);
      return { stories_created: 0, stories_published: 0 };
    }

    const stories = data || [];
    const stories_created = stories.length;
    const stories_published = stories.filter(story => story.is_published).length;

    return {
      stories_created,
      stories_published,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { stories_created: 0, stories_published: 0 };
  }
}


export async function getUserWithModeratorStatus(user: Record<string, unknown>): Promise<AuthUser | null> {
  if (!user || !user.id) return null;

  const isMod = await isModerator(user.id as string);
  const stats = await getUserStats(user.id as string);

  return {
    id: user.id as string,
    email: (user.email as string) || '',
    is_moderator: isMod,
    user_metadata: {
      ...(user.user_metadata as { username?: string }) || {},
      stats
    }
  };
}
