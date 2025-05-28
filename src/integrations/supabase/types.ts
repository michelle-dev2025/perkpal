export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "auth.uses": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_amount: number
          generation: number
          id: string
          paid_at: string
          referred_id: string
          referrer_id: string
        }
        Insert: {
          bonus_amount: number
          generation: number
          id?: string
          paid_at?: string
          referred_id: string
          referrer_id: string
        }
        Update: {
          bonus_amount?: number
          generation?: number
          id?: string
          paid_at?: string
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string
          id: string
          is_active: boolean
          reward_amount: number
          task_type: string
          title: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          reward_amount: number
          task_type: string
          title: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          reward_amount?: number
          task_type?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          status?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed_at: string
          id: string
          reward_earned: number
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          reward_earned: number
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          reward_earned?: number
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          payment_required: boolean | null
          phone: string | null
          referral_code: string
          referred_by: string | null
          registration_bonus_claimed: boolean
          registration_payment_amount: number | null
          registration_payment_status: string | null
          total_earned: number
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          payment_required?: boolean | null
          phone?: string | null
          referral_code: string
          referred_by?: string | null
          registration_bonus_claimed?: boolean
          registration_payment_amount?: number | null
          registration_payment_status?: string | null
          total_earned?: number
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          payment_required?: boolean | null
          phone?: string | null
          referral_code?: string
          referred_by?: string | null
          registration_bonus_claimed?: boolean
          registration_payment_amount?: number | null
          registration_payment_status?: string | null
          total_earned?: number
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          account_name: string | null
          account_number: string | null
          admin_notes: string | null
          amount: number
          bank_name: string | null
          id: string
          processed_at: string | null
          requested_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          admin_notes?: string | null
          amount: number
          bank_name?: string | null
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          admin_notes?: string | null
          amount?: number
          bank_name?: string | null
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
