import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          role: 'customer' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
        }
      }
      hotels: {
        Row: {
          id: string
          name: string
          location: string
          image: string
          description: string
          rating: number | null
          distance_to_haram: string | null
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          image: string
          description: string
          rating?: number | null
          distance_to_haram?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          image?: string
          description?: string
          rating?: number | null
          distance_to_haram?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      transfers: {
        Row: {
          id: string
          name: string
          type: 'bus' | 'car' | 'van'
          description: string
          capacity: number
          price: number
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'bus' | 'car' | 'van'
          description: string
          capacity: number
          price: number
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'bus' | 'car' | 'van'
          description?: string
          capacity?: number
          price?: number
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      flights: {
        Row: {
          id: string
          airline: string
          flight_number: string
          departure: string
          destination: string
          departure_time: string
          arrival_time: string
          class: 'economy' | 'business' | 'first'
          price: number
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          airline: string
          flight_number: string
          departure: string
          destination: string
          departure_time: string
          arrival_time: string
          class: 'economy' | 'business' | 'first'
          price: number
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          airline?: string
          flight_number?: string
          departure?: string
          destination?: string
          departure_time?: string
          arrival_time?: string
          class?: 'economy' | 'business' | 'first'
          price?: number
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      packages: {
        Row: {
          id: string
          title: string
          price: number
          duration: number
          image: string
          description: string
          features: string[]
          hotel_id: string
          transfer_id: string
          flight_departure: string
          flight_destination: string
          rating: number
          location: string
          category: 'premium' | 'standard' | 'economy'
          status: 'active' | 'inactive'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          price: number
          duration: number
          image: string
          description: string
          features: string[]
          hotel_id: string
          transfer_id: string
          flight_departure: string
          flight_destination: string
          rating?: number
          location: string
          category: 'premium' | 'standard' | 'economy'
          status?: 'active' | 'inactive'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          price?: number
          duration?: number
          image?: string
          description?: string
          features?: string[]
          hotel_id?: string
          transfer_id?: string
          flight_departure?: string
          flight_destination?: string
          rating?: number
          location?: string
          category?: 'premium' | 'standard' | 'economy'
          status?: 'active' | 'inactive'
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          package_id: string
          user_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_rooms: number
          number_of_guests: number
          status: 'pending' | 'confirmed' | 'cancelled'
          total_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          package_id: string
          user_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          number_of_rooms: number
          number_of_guests: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          package_id?: string
          user_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          number_of_rooms?: number
          number_of_guests?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          total_amount?: number
          created_at?: string
        }
      }
    }
  }
}