import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Supabase project URL
const supabaseAnonKey = 'YOUR_ANON_KEY'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);