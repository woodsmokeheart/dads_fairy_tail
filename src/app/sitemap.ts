import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Статические страницы
  const staticPages = [
    {
      url: 'https://dads-fairy-tales.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://dads-fairy-tales.vercel.app/about',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: 'https://dads-fairy-tales.vercel.app/stories',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  // Динамические страницы сказок
  let storyPages: MetadataRoute.Sitemap = []
  
  try {
    const { data: stories } = await supabase
      .from('stories')
      .select('id, updated_at')
      .eq('is_published', true)
      .limit(1000) // Ограничиваем для производительности

    if (stories) {
      storyPages = stories.map((story) => ({
        url: `https://dads-fairy-tales.vercel.app/story/${story.id}`,
        lastModified: new Date(story.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Error fetching stories for sitemap:', error)
  }

  return [...staticPages, ...storyPages]
}
