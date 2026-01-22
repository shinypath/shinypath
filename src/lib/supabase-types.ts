export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AppRole = 'admin' | 'user';

export interface Database {
  public: {
    Tables: {
      cleaning_quotes: {
        Row: {
          id: string
          form_type: string
          cleaning_type: string
          frequency: string
          client_name: string
          client_email: string
          client_phone: string
          client_address: string
          preferred_date: string
          preferred_time: string | null
          details: string | null
          bathrooms: string
          bedrooms: string
          kitchens: number
          living_rooms: number
          extras: string[]
          laundry_persons: number
          total: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_type: string
          cleaning_type: string
          frequency: string
          client_name: string
          client_email: string
          client_phone: string
          client_address: string
          preferred_date: string
          preferred_time?: string | null
          details?: string | null
          bathrooms?: string
          bedrooms?: string
          kitchens?: number
          living_rooms?: number
          extras?: string[]
          laundry_persons?: number
          total?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_type?: string
          cleaning_type?: string
          frequency?: string
          client_name?: string
          client_email?: string
          client_phone?: string
          client_address?: string
          preferred_date?: string
          preferred_time?: string | null
          details?: string | null
          bathrooms?: string
          bedrooms?: string
          kitchens?: number
          living_rooms?: number
          extras?: string[]
          laundry_persons?: number
          total?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: AppRole
        }
        Insert: {
          id?: string
          user_id: string
          role: AppRole
        }
        Update: {
          id?: string
          user_id?: string
          role?: AppRole
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: AppRole
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: AppRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type CleaningQuote = Database['public']['Tables']['cleaning_quotes']['Row'];
export type CleaningQuoteInsert = Database['public']['Tables']['cleaning_quotes']['Insert'];
export type CleaningQuoteUpdate = Database['public']['Tables']['cleaning_quotes']['Update'];
