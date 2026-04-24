import { createClient } from '@supabase/supabase-js';

export default async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );

    const { tableName, limit = 50, offset = 0 } = req.query;

    if (!tableName) {
      return res.status(400).json({ error: 'tableName query parameter is required' });
    }

    console.log(`[Database] Fetching data from ${tableName} (limit: ${limit}, offset: ${offset})`);

    // Fetch data from the specified table
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error(`[Database] Error fetching data from ${tableName}:`, error);
      return res.status(500).json({ 
        error: `Failed to fetch data from ${tableName}`, 
        details: error.message 
      });
    }

    console.log(`[Database] Got ${data?.length || 0} rows from ${tableName}`);

    res.status(200).json({
      tableName,
      data: data || [],
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

  } catch (error) {
    console.error(`[Database] Error:`, error.message);
    res.status(500).json({ error: 'Failed to fetch table data', details: error.message });
  }
};
