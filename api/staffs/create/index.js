import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { names, category_specialty } = req.body;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('[Staffs:Create] Missing Supabase config');
      return res.status(500).json({ error: 'Server misconfigured' });
    }

    if (!names || !names.trim()) {
      return res.status(400).json({ error: 'Staff name is required' });
    }

    if (!category_specialty || !category_specialty.trim()) {
      return res.status(400).json({ error: 'Category/Specialty is required' });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });

    console.log('[Staffs:Create] Creating new staff:', { names, category_specialty });

    const { data, error } = await supabase
      .from('staffs')
      .insert([{
        names: names.trim(),
        category_specialty: category_specialty.trim()
      }])
      .select();

    if (error) {
      console.error('[Staffs:Create] Query error:', error);
      return res.status(400).json({ error: 'Failed to create staff', details: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(400).json({ error: 'Failed to create staff' });
    }

    console.log('[Staffs:Create] Successfully created staff:', data[0].id);
    return res.status(201).json({ 
      message: 'Staff created successfully', 
      staff: data[0] 
    });

  } catch (error) {
    console.error('[Staffs:Create] Exception:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};
