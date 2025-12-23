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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          check_in: string
          check_out: string
          coins_used: number | null
          created_at: string | null
          discount_applied: number | null
          hotel_id: string
          id: string
          room_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          check_in: string
          check_out: string
          coins_used?: number | null
          created_at?: string | null
          discount_applied?: number | null
          hotel_id: string
          id?: string
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          check_in?: string
          check_out?: string
          coins_used?: number | null
          created_at?: string | null
          discount_applied?: number | null
          hotel_id?: string
          id?: string
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string | null
          description: string | null
          id: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          coins_required: number
          created_at: string | null
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          hotel_id: string
          id: string
          is_active: boolean | null
          name: string
          target: Database["public"]["Enums"]["discount_target"]
          updated_at: string | null
        }
        Insert: {
          coins_required: number
          created_at?: string | null
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          hotel_id: string
          id?: string
          is_active?: boolean | null
          name: string
          target: Database["public"]["Enums"]["discount_target"]
          updated_at?: string | null
        }
        Update: {
          coins_required?: number
          created_at?: string | null
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          hotel_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          target?: Database["public"]["Enums"]["discount_target"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discounts_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string | null
          description: string | null
          hotel_id: string
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          description?: string | null
          hotel_id: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string | null
          description?: string | null
          hotel_id?: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_items_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          base_coin_deduction: number
          category: Database["public"]["Enums"]["hotel_category"] | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          base_coin_deduction?: number
          category?: Database["public"]["Enums"]["hotel_category"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          base_coin_deduction?: number
          category?: Database["public"]["Enums"]["hotel_category"] | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          location: string | null
          phone: string | null
          total_coins: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          location?: string | null
          phone?: string | null
          total_coins?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          location?: string | null
          phone?: string | null
          total_coins?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          available_rooms: number | null
          created_at: string | null
          description: string | null
          hotel_id: string
          id: string
          images: string[] | null
          is_available: boolean | null
          name: string
          price_per_night: number
          total_rooms: number | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          available_rooms?: number | null
          created_at?: string | null
          description?: string | null
          hotel_id: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          name: string
          price_per_night: number
          total_rooms?: number | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          available_rooms?: number | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          name?: string
          price_per_night?: number
          total_rooms?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tourist" | "hotel_owner" | "admin"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      discount_target: "room" | "food"
      discount_type: "flat" | "percentage" | "free_item"
      food_category: "veg" | "non_veg" | "drinks" | "desserts"
      hotel_category: "budget" | "premium" | "resort"
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
    Enums: {
      app_role: ["tourist", "hotel_owner", "admin"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      discount_target: ["room", "food"],
      discount_type: ["flat", "percentage", "free_item"],
      food_category: ["veg", "non_veg", "drinks", "desserts"],
      hotel_category: ["budget", "premium", "resort"],
    },
  },
} as const
