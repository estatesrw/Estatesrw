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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accommodation_bookings: {
        Row: {
          approved_at: string | null
          booking_ref: string
          cancellation_policy: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          commission_amount: number
          created_at: string
          guest_email: string | null
          guest_id: string
          guest_name: string
          guest_phone: string | null
          guests: number
          id: string
          nights: number
          notes: string | null
          payment_method: string | null
          payment_status: string
          property_id: string
          room_type_id: string
          status: string
          total_price: number
          updated_at: string
          vendor_id: string
          vendor_payout: number
        }
        Insert: {
          approved_at?: string | null
          booking_ref?: string
          cancellation_policy?: string | null
          cancelled_at?: string | null
          check_in: string
          check_out: string
          commission_amount?: number
          created_at?: string
          guest_email?: string | null
          guest_id: string
          guest_name: string
          guest_phone?: string | null
          guests?: number
          id?: string
          nights?: number
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          property_id: string
          room_type_id: string
          status?: string
          total_price?: number
          updated_at?: string
          vendor_id: string
          vendor_payout?: number
        }
        Update: {
          approved_at?: string | null
          booking_ref?: string
          cancellation_policy?: string | null
          cancelled_at?: string | null
          check_in?: string
          check_out?: string
          commission_amount?: number
          created_at?: string
          guest_email?: string | null
          guest_id?: string
          guest_name?: string
          guest_phone?: string | null
          guests?: number
          id?: string
          nights?: number
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          property_id?: string
          room_type_id?: string
          status?: string
          total_price?: number
          updated_at?: string
          vendor_id?: string
          vendor_payout?: number
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      advertisements: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          link_url: string
          status: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          link_url: string
          status?: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          link_url?: string
          status?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      agent_referrals: {
        Row: {
          agent_id: string
          booking_id: string | null
          commission_amount: number
          commission_rate: number
          created_at: string
          guest_email: string | null
          guest_name: string
          guest_phone: string | null
          id: string
          notes: string | null
          property_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          booking_id?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          guest_email?: string | null
          guest_name: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          booking_id?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          guest_email?: string | null
          guest_name?: string
          guest_phone?: string | null
          id?: string
          notes?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_referrals_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "accommodation_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_referrals_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          bio: string | null
          commission_rate: number
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          commission_rate?: number
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          property_id: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          property_id: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          property_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
          property_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          property_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          property_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blocked_dates: {
        Row: {
          created_at: string
          end_date: string
          id: string
          property_id: string
          reason: string | null
          room_type_id: string | null
          start_date: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          property_id: string
          reason?: string | null
          room_type_id?: string | null
          start_date: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          property_id?: string
          reason?: string | null
          room_type_id?: string | null
          start_date?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocked_dates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_dates_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_dates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          monthly_rent: number
          property_id: string
          start_date: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_rent?: number
          property_id: string
          start_date: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          monthly_rent?: number
          property_id?: string
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          code: string
          created_at: string
          display_order: number
          id: string
          name: string
          property_id: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          display_order?: number
          id?: string
          name: string
          property_id: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_availability: {
        Row: {
          booking_id: string | null
          created_at: string
          date: string
          id: string
          price_override: number | null
          status: string
          unit_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          date: string
          id?: string
          price_override?: number | null
          status?: string
          unit_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          date?: string
          id?: string
          price_override?: number | null
          status?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_availability_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "accommodation_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_availability_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_links: {
        Row: {
          created_at: string
          ical_url: string
          id: string
          last_synced_at: string | null
          platform: string
          property_id: string
          room_type_id: string | null
          sync_status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          ical_url: string
          id?: string
          last_synced_at?: string | null
          platform?: string
          property_id: string
          room_type_id?: string | null
          sync_status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          ical_url?: string
          id?: string
          last_synced_at?: string | null
          platform?: string
          property_id?: string
          room_type_id?: string | null
          sync_status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_links_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_links_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_links_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          service_type: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service_type: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service_type?: string
          status?: string
        }
        Relationships: []
      }
      floors: {
        Row: {
          building_id: string
          created_at: string
          id: string
          label: string | null
          level: number
        }
        Insert: {
          building_id: string
          created_at?: string
          id?: string
          label?: string | null
          level: number
        }
        Update: {
          building_id?: string
          created_at?: string
          id?: string
          label?: string | null
          level?: number
        }
        Relationships: [
          {
            foreignKeyName: "floors_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      leases: {
        Row: {
          created_at: string
          created_by: string | null
          deposit: number
          end_date: string | null
          id: string
          monthly_rent: number
          notes: string | null
          payment_day: number
          property_id: string
          start_date: string
          status: string
          tenant_email: string | null
          tenant_id: string
          tenant_name: string
          tenant_phone: string | null
          unit_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deposit?: number
          end_date?: string | null
          id?: string
          monthly_rent?: number
          notes?: string | null
          payment_day?: number
          property_id: string
          start_date: string
          status?: string
          tenant_email?: string | null
          tenant_id: string
          tenant_name: string
          tenant_phone?: string | null
          unit_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deposit?: number
          end_date?: string | null
          id?: string
          monthly_rent?: number
          notes?: string | null
          payment_day?: number
          property_id?: string
          start_date?: string
          status?: string
          tenant_email?: string | null
          tenant_id?: string
          tenant_name?: string
          tenant_phone?: string | null
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leases_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leases_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          id: string
          priority: string
          property_id: string
          reported_by: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          property_id: string
          reported_by: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          id?: string
          priority?: string
          property_id?: string
          reported_by?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_tickets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      management_agreements: {
        Row: {
          agent_commission_percent: number
          created_at: string
          end_date: string | null
          id: string
          management_fee_percent: number
          notes: string | null
          property_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_commission_percent?: number
          created_at?: string
          end_date?: string | null
          id?: string
          management_fee_percent?: number
          notes?: string | null
          property_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_commission_percent?: number
          created_at?: string
          end_date?: string | null
          id?: string
          management_fee_percent?: number
          notes?: string | null
          property_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "management_agreements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          member_role: Database["public"]["Enums"]["org_member_role"]
          organization_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          organization_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          member_role?: Database["public"]["Enums"]["org_member_role"]
          organization_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          country: string
          created_at: string
          created_by: string | null
          id: string
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          country?: string
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string | null
          id: string
          payment_method: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          amount: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_properties: {
        Row: {
          address: string
          city: string
          code: string
          country: string
          cover_image: string | null
          created_at: string
          currency: string
          description: string | null
          id: string
          name: string
          organization_id: string
          status: string
          unit_id_format: string
          updated_at: string
        }
        Insert: {
          address: string
          city?: string
          code: string
          country?: string
          cover_image?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
          status?: string
          unit_id_format?: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          code?: string
          country?: string
          cover_image?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
          status?: string
          unit_id_format?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pm_properties_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          amenities: string[] | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string
          country: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          landlord_id: string
          latitude: number | null
          longitude: number | null
          price: number
          property_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          address: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          landlord_id: string
          latitude?: number | null
          longitude?: number | null
          price?: number
          property_type?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          amenities?: string[] | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          landlord_id?: string
          latitude?: number | null
          longitude?: number | null
          price?: number
          property_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_assignments: {
        Row: {
          assignment_role: Database["public"]["Enums"]["pm_assignment_role"]
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          assignment_role: Database["public"]["Enums"]["pm_assignment_role"]
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          assignment_role?: Database["public"]["Enums"]["pm_assignment_role"]
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_assignments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          property_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          property_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      rent_invoices: {
        Row: {
          amount: number
          amount_paid: number
          created_at: string
          due_date: string
          id: string
          lease_id: string
          paid_at: string | null
          period_start: string
          property_id: string
          reference: string | null
          status: string
          tenant_id: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          amount_paid?: number
          created_at?: string
          due_date: string
          id?: string
          lease_id: string
          paid_at?: string | null
          period_start: string
          property_id: string
          reference?: string | null
          status?: string
          tenant_id: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_paid?: number
          created_at?: string
          due_date?: string
          id?: string
          lease_id?: string
          paid_at?: string | null
          period_start?: string
          property_id?: string
          reference?: string | null
          status?: string
          tenant_id?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rent_invoices_lease_id_fkey"
            columns: ["lease_id"]
            isOneToOne: false
            referencedRelation: "leases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rent_invoices_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          property_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          property_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          property_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "accommodation_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          amenities: string[] | null
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          max_guests: number
          minimum_stay: number
          monthly_price: number | null
          name: string
          price_per_night: number
          property_id: string
          status: string
          total_rooms: number
          updated_at: string
          vendor_id: string
          weekend_price: number | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_guests?: number
          minimum_stay?: number
          monthly_price?: number | null
          name: string
          price_per_night?: number
          property_id: string
          status?: string
          total_rooms?: number
          updated_at?: string
          vendor_id: string
          weekend_price?: number | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          max_guests?: number
          minimum_stay?: number
          monthly_price?: number | null
          name?: string
          price_per_night?: number
          property_id?: string
          status?: string
          total_rooms?: number
          updated_at?: string
          vendor_id?: string
          weekend_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_types_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          notes: string | null
          property_id: string | null
          provider_id: string
          scheduled_date: string
          scheduled_time: string | null
          service_id: string
          status: string
          total_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          notes?: string | null
          property_id?: string | null
          provider_id: string
          scheduled_date: string
          scheduled_time?: string | null
          service_id: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          notes?: string | null
          property_id?: string | null
          provider_id?: string
          scheduled_date?: string
          scheduled_time?: string | null
          service_id?: string
          status?: string
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string
          city: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          price: number
          price_type: string
          provider_id: string
          rating: number | null
          status: string
          title: string
          total_reviews: number | null
          updated_at: string
        }
        Insert: {
          category?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          price_type?: string
          provider_id: string
          rating?: number | null
          status?: string
          title: string
          total_reviews?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          price?: number
          price_type?: string
          provider_id?: string
          rating?: number | null
          status?: string
          title?: string
          total_reviews?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      unit_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string
          unit_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          unit_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_images_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      unit_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["unit_status"] | null
          id: string
          note: string | null
          property_id: string
          to_status: Database["public"]["Enums"]["unit_status"]
          unit_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["unit_status"] | null
          id?: string
          note?: string | null
          property_id: string
          to_status: Database["public"]["Enums"]["unit_status"]
          unit_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["unit_status"] | null
          id?: string
          note?: string | null
          property_id?: string
          to_status?: Database["public"]["Enums"]["unit_status"]
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_status_history_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unit_status_history_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          bathrooms: number
          bedrooms: number
          building_id: string
          created_at: string
          deposit: number | null
          features: string[]
          floor_id: string
          furnished: string
          id: string
          images: string[]
          monthly_rent: number
          notes: string | null
          parking_spaces: number
          property_id: string
          size_sqm: number | null
          status: Database["public"]["Enums"]["unit_status"]
          unit_code: string
          unit_number: string
          updated_at: string
          view_description: string | null
        }
        Insert: {
          bathrooms?: number
          bedrooms?: number
          building_id: string
          created_at?: string
          deposit?: number | null
          features?: string[]
          floor_id: string
          furnished?: string
          id?: string
          images?: string[]
          monthly_rent?: number
          notes?: string | null
          parking_spaces?: number
          property_id: string
          size_sqm?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_code: string
          unit_number: string
          updated_at?: string
          view_description?: string | null
        }
        Update: {
          bathrooms?: number
          bedrooms?: number
          building_id?: string
          created_at?: string
          deposit?: number | null
          features?: string[]
          floor_id?: string
          furnished?: string
          id?: string
          images?: string[]
          monthly_rent?: number
          notes?: string | null
          parking_spaces?: number
          property_id?: string
          size_sqm?: number | null
          status?: Database["public"]["Enums"]["unit_status"]
          unit_code?: string
          unit_number?: string
          updated_at?: string
          view_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "pm_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_commissions: {
        Row: {
          booking_amount: number
          booking_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          paid_at: string | null
          status: string
          vendor_id: string
          vendor_payout: number
        }
        Insert: {
          booking_amount: number
          booking_id: string
          commission_amount: number
          commission_rate: number
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          vendor_id: string
          vendor_payout: number
        }
        Update: {
          booking_amount?: number
          booking_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: string
          vendor_id?: string
          vendor_payout?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendor_commissions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "accommodation_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_commissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          business_name: string
          business_type: string
          city: string
          commission_rate: number
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          business_name: string
          business_type?: string
          city?: string
          commission_rate?: number
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          business_name?: string
          business_type?: string
          city?: string
          commission_rate?: number
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          payment_details: Json | null
          payment_method: string
          processed_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          payment_details?: Json | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      building_property_id: { Args: { _building_id: string }; Returns: string }
      floor_property_id: { Args: { _floor_id: string }; Returns: string }
      get_vendor_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_property_owner: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      is_vendor_owner: {
        Args: { _user_id: string; _vendor_id: string }
        Returns: boolean
      }
      pm_can_manage_property: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      pm_can_view_owner_finances: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      pm_can_view_property: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      pm_is_tenant_of_property: {
        Args: { _property_id: string; _user_id: string }
        Returns: boolean
      }
      pm_is_tenant_of_unit: {
        Args: { _unit_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "tenant"
        | "landlord"
        | "service_provider"
        | "admin"
        | "vendor"
        | "agent"
      org_member_role: "owner" | "admin" | "member"
      pm_assignment_role: "manager" | "agent"
      unit_status:
        | "available"
        | "viewing"
        | "reserved"
        | "lease_pending"
        | "occupied"
        | "notice_given"
        | "move_out"
        | "inspection"
        | "maintenance"
        | "offline"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "tenant",
        "landlord",
        "service_provider",
        "admin",
        "vendor",
        "agent",
      ],
      org_member_role: ["owner", "admin", "member"],
      pm_assignment_role: ["manager", "agent"],
      unit_status: [
        "available",
        "viewing",
        "reserved",
        "lease_pending",
        "occupied",
        "notice_given",
        "move_out",
        "inspection",
        "maintenance",
        "offline",
      ],
    },
  },
} as const
