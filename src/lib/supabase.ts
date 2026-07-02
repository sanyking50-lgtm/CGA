import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client (anon key) - for client-side and public API
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (service role) - for server-side admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string | null;
          phone: string | null;
          whatsapp: string | null;
          youtube_channel: string | null;
          avatar_url: string | null;
          role: string;
          staff_role: string | null;
          level: string;
          orders_count: number;
          streak_count: number;
          last_login_at: string | null;
          points: number;
          referral_code: string | null;
          referred_by: string | null;
          referral_level: number;
          staff_token: string | null;
          country_code: string;
          locale: string;
          currency: string;
          is_free_trial_used: boolean;
          is_verified: boolean;
          email_verified: boolean;
          phone_verified: boolean;
          is_active: boolean;
          badges: unknown;
          created_at: string;
          updated_at: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          service_type: string;
          package_name: string | null;
          package_price: number;
          express_delivery: boolean;
          express_fee: number;
          total_price_bdt: number;
          total_price_local: number | null;
          currency: string;
          advance_amount: number | null;
          remaining_amount: number | null;
          is_free_trial: boolean;
          status: string;
          assigned_to: string | null;
          drive_link: string | null;
          file_url: string | null;
          delivery_url: string | null;
          instructions: string | null;
          internal_notes: string | null;
          subscription_id: string | null;
          coupon_id: string | null;
          discount_amount: number;
          delivery_deadline: string | null;
          delivered_at: string | null;
          country_code: string;
          payment_gateway: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};