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

    const { tableNames } = req.query;
    
    // If specific tables are requested, fetch their info
    if (tableNames) {
      const tables = Array.isArray(tableNames) ? tableNames : [tableNames];
      const tableInfo = [];

      for (const tableName of tables) {
        console.log(`[Database] Fetching schema for table: ${tableName}`);
        
        try {
          // Try to fetch a single row to get column info
          const { data, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          let rowCount = 0;
          let columns = [];

          // Get row count
          if (!fetchError) {
            const { count, error: countError } = await supabase
              .from(tableName)
              .select('*', { count: 'exact', head: true });
            
            if (!countError) {
              rowCount = count || 0;
            }

            // Extract column names from the response
            if (data && data.length > 0) {
              columns = Object.keys(data[0]).map(name => ({
                column_name: name,
                data_type: typeof data[0][name] === 'string' ? 'text' : typeof data[0][name]
              }));
            } else {
              // If no data, try to infer from an empty query
              const { data: emptyData } = await supabase
                .from(tableName)
                .select('*')
                .limit(0);
              
              if (emptyData) {
                columns = Object.keys(emptyData).map(name => ({
                  column_name: name,
                  data_type: 'unknown'
                }));
              }
            }
          }

          tableInfo.push({
            name: tableName,
            rowCount,
            columns: columns || [],
            created_at: null
          });

          console.log(`[Database] Got info for ${tableName}: ${rowCount} rows, ${columns.length} columns`);
        } catch (tableError) {
          console.error(`[Database] Error fetching table ${tableName}:`, tableError.message);
          tableInfo.push({
            name: tableName,
            rowCount: 0,
            columns: [],
            error: tableError.message
          });
        }
      }

      return res.status(200).json(tableInfo);
    }

    // If no specific tables requested, return empty array
    console.log('[Database] No specific tables requested');
    res.status(200).json([]);

  } catch (error) {
    console.error(`[Database] Error:`, error.message);
    res.status(500).json({ error: 'Failed to fetch database tables', details: error.message });
  }
};
