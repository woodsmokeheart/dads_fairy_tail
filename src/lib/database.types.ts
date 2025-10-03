export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          avatar_url: string | null
          is_moderator: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_url?: string | null
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_url?: string | null
          is_moderator?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      stories: {
        Row: {
          id: string
          title: string
          content: string
          content_text: string
          cover_image_url: string | null
          author_id: string
          is_published: boolean
          views_count: number
          collection_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          content_text: string
          cover_image_url?: string | null
          author_id: string
          is_published?: boolean
          views_count?: number
          collection_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          content_text?: string
          cover_image_url?: string | null
          author_id?: string
          is_published?: boolean
          views_count?: number
          collection_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stories_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_collections: {
        Row: {
          id: string
          user_id: string
          story_id: string
          added_at: string
        }
        Insert: {
          id?: string
          user_id: string
          story_id: string
          added_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          story_id?: string
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collections_story_id_fkey"
            columns: ["story_id"]
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_collections_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_collection_count: {
        Args: {
          story_id: string
        }
        Returns: void
      }
      decrement_collection_count: {
        Args: {
          story_id: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
