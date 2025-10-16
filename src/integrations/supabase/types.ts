export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_sentences: {
        Row: {
          category: string | null
          created_at: string | null
          date: string | null
          english: string
          id: string
          level: string | null
          telugu: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          english: string
          id?: string
          level?: string | null
          telugu: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          date?: string | null
          english?: string
          id?: string
          level?: string | null
          telugu?: string
        }
        Relationships: []
      }
      generated_lessons: {
        Row: {
          count: number | null
          created_at: string | null
          generation_date: string | null
          id: string
          lesson_type: string
          level: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          generation_date?: string | null
          id?: string
          lesson_type: string
          level?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          generation_date?: string | null
          id?: string
          lesson_type?: string
          level?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          completed: boolean | null
          content: Json
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          level: string | null
          order_index: number | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          content: Json
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          level?: string | null
          order_index?: number | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          content?: Json
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          level?: string | null
          order_index?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mistakes: {
        Row: {
          corrected_text: string | null
          created_at: string | null
          explanation: string | null
          frequency: number | null
          id: string
          mistake_type: string | null
          original_text: string | null
          user_id: string
        }
        Insert: {
          corrected_text?: string | null
          created_at?: string | null
          explanation?: string | null
          frequency?: number | null
          id?: string
          mistake_type?: string | null
          original_text?: string | null
          user_id: string
        }
        Update: {
          corrected_text?: string | null
          created_at?: string | null
          explanation?: string | null
          frequency?: number | null
          id?: string
          mistake_type?: string | null
          original_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          last_practice_date: string | null
          level: string | null
          streak_days: number | null
          total_practice_time: number | null
          total_words_learned: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_practice_date?: string | null
          level?: string | null
          streak_days?: number | null
          total_practice_time?: number | null
          total_words_learned?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_practice_date?: string | null
          level?: string | null
          streak_days?: number | null
          total_practice_time?: number | null
          total_words_learned?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_vocabulary: {
        Row: {
          created_at: string | null
          favorite: boolean | null
          id: string
          last_practiced: string | null
          learned: boolean | null
          practice_count: number | null
          user_id: string
          vocabulary_id: string | null
        }
        Insert: {
          created_at?: string | null
          favorite?: boolean | null
          id?: string
          last_practiced?: string | null
          learned?: boolean | null
          practice_count?: number | null
          user_id: string
          vocabulary_id?: string | null
        }
        Update: {
          created_at?: string | null
          favorite?: boolean | null
          id?: string
          last_practiced?: string | null
          learned?: boolean | null
          practice_count?: number | null
          user_id?: string
          vocabulary_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      verb_forms: {
        Row: {
          base_form: string
          base_form_telugu: string
          category: string | null
          created_at: string | null
          date: string | null
          example_sentence: string | null
          example_sentence_telugu: string | null
          future_simple: string
          id: string
          level: string | null
          past_continuous: string
          past_simple: string
          present_continuous: string
          present_perfect: string
          present_simple: string
        }
        Insert: {
          base_form: string
          base_form_telugu: string
          category?: string | null
          created_at?: string | null
          date?: string | null
          example_sentence?: string | null
          example_sentence_telugu?: string | null
          future_simple: string
          id?: string
          level?: string | null
          past_continuous: string
          past_simple: string
          present_continuous: string
          present_perfect: string
          present_simple: string
        }
        Update: {
          base_form?: string
          base_form_telugu?: string
          category?: string | null
          created_at?: string | null
          date?: string | null
          example_sentence?: string | null
          example_sentence_telugu?: string | null
          future_simple?: string
          id?: string
          level?: string | null
          past_continuous?: string
          past_simple?: string
          present_continuous?: string
          present_perfect?: string
          present_simple?: string
        }
        Relationships: []
      }
      vocabulary: {
        Row: {
          created_at: string | null
          english: string
          examples: Json | null
          id: string
          level: string | null
          part_of_speech: string | null
          pronunciation: string | null
          telugu: string
        }
        Insert: {
          created_at?: string | null
          english: string
          examples?: Json | null
          id?: string
          level?: string | null
          part_of_speech?: string | null
          pronunciation?: string | null
          telugu: string
        }
        Update: {
          created_at?: string | null
          english?: string
          examples?: Json | null
          id?: string
          level?: string | null
          part_of_speech?: string | null
          pronunciation?: string | null
          telugu?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
