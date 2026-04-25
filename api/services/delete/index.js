import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    console.log(`[Services:Delete] Deleting service ID: ${id}`);

    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error(`[Services:Delete] Delete error for ID ${id}:`, error);
      return res.status(400).json({ error: 'Failed to delete service', details: error.message });
    }

    console.log(`[Services:Delete] Successfully deleted service ${id}`);
    return res.status(200).json({ 
      message: 'Service deleted successfully' 
    });

  } catch (error) {
    console.error(`[Services:Delete] Unexpected error:`, error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
