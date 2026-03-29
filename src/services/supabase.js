import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if credentials exist, otherwise export null
let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Add to .env file:');
  console.warn('VITE_SUPABASE_URL=your-project.supabase.co');
  console.warn('VITE_SUPABASE_ANON_KEY=your-anon-key');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
  }
}

export { supabase };
