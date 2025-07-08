export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advisory_reports: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string
          report_text: string | null
          report_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id: string
          report_text?: string | null
          report_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string
          report_text?: string | null
          report_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisory_reports_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string | null
          cover_letter_url: string | null
          id: string
          job_id: string
          profile_id: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applied_at?: string | null
          cover_letter_url?: string | null
          id?: string
          job_id: string
          profile_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_at?: string | null
          cover_letter_url?: string | null
          id?: string
          job_id?: string
          profile_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      career_recs: {
        Row: {
          created_at: string | null
          description: string | null
          growth: string | null
          id: string
          match_score: number | null
          profile_id: string
          salary_range: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          growth?: string | null
          id?: string
          match_score?: number | null
          profile_id: string
          salary_range?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          growth?: string | null
          id?: string
          match_score?: number | null
          profile_id?: string
          salary_range?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_recs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string | null
          credential_id: string | null
          id: string
          name: string | null
          profile_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          credential_id?: string | null
          id?: string
          name?: string | null
          profile_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          credential_id?: string | null
          id?: string
          name?: string | null
          profile_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "certifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educations: {
        Row: {
          created_at: string | null
          degree: string | null
          end_year: number | null
          id: string
          institution: string | null
          profile_id: string
          start_year: number | null
        }
        Insert: {
          created_at?: string | null
          degree?: string | null
          end_year?: number | null
          id?: string
          institution?: string | null
          profile_id: string
          start_year?: number | null
        }
        Update: {
          created_at?: string | null
          degree?: string | null
          end_year?: number | null
          id?: string
          institution?: string | null
          profile_id?: string
          start_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "educations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          profile_id: string
          start_date: string | null
          title: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          profile_id: string
          start_date?: string | null
          title?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          profile_id?: string
          start_date?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "experiences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_prefs: {
        Row: {
          created_at: string | null
          desired_roles: string[] | null
          id: string
          preferred_cities: string[] | null
          profile_id: string
          salary_expectation: string | null
          work_style: string | null
        }
        Insert: {
          created_at?: string | null
          desired_roles?: string[] | null
          id?: string
          preferred_cities?: string[] | null
          profile_id: string
          salary_expectation?: string | null
          work_style?: string | null
        }
        Update: {
          created_at?: string | null
          desired_roles?: string[] | null
          id?: string
          preferred_cities?: string[] | null
          profile_id?: string
          salary_expectation?: string | null
          work_style?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_prefs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          benefits: string[] | null
          company: string
          description: string | null
          experience_level: string | null
          fetched_at: string | null
          id: string
          job_type: string | null
          location: string
          posted_at: string | null
          requirements: string[] | null
          salary: string | null
          source_url: string | null
          status: string | null
          summary: string | null
          title: string
        }
        Insert: {
          benefits?: string[] | null
          company: string
          description?: string | null
          experience_level?: string | null
          fetched_at?: string | null
          id?: string
          job_type?: string | null
          location: string
          posted_at?: string | null
          requirements?: string[] | null
          salary?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          benefits?: string[] | null
          company?: string
          description?: string | null
          experience_level?: string | null
          fetched_at?: string | null
          id?: string
          job_type?: string | null
          location?: string
          posted_at?: string | null
          requirements?: string[] | null
          salary?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      profile_skills: {
        Row: {
          id: string
          level: number | null
          profile_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          level?: number | null
          profile_id: string
          skill_id: string
        }
        Update: {
          id?: string
          level?: number | null
          profile_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          mobile: string | null
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          mobile?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skill_gaps: {
        Row: {
          created_at: string | null
          id: string
          importance: string | null
          missing_skill: string | null
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          importance?: string | null
          missing_skill?: string | null
          profile_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          importance?: string | null
          missing_skill?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_gaps_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_full_profile: {
        Args: { uid: string }
        Returns: Json
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
