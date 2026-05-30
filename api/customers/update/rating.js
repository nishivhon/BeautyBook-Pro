import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env only in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
}

export default async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId, historyId, id, date, service, staff, rating } = req.body;
  const targetHistoryId = historyId || id;

  if (!customerId || (!targetHistoryId && (!date || !service || !staff)) || rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'customerId, historyId (or date, service, staff), and rating (1-5) are required' });
  }

  try {
    console.log(`[RateService] Rating service for customer ${customerId}: date=${date}, service=${service}, staff=${staff}, rating=${rating}`);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[RateService] Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });

    console.log('[RateService] Step 1: Fetching customer with id:', customerId);
    const { data: customer, error: customerError } = await supabase
      .from('customers_accounts')
      .select('id, histories')
      .eq('id', customerId)
      .single();

    if (customerError) {
      console.error('[RateService] Customer fetch error:', customerError);
      return res.status(500).json({ error: 'Failed to fetch customer', details: customerError.message });
    }

    if (!customer) {
      console.error('[RateService] Customer not found');
      return res.status(404).json({ error: 'Customer not found' });
    }

    console.log('[RateService] Step 2: Parsing histories array');
    let histories = customer.histories || [];
    if (typeof histories === 'string') {
      try {
        histories = JSON.parse(histories);
      } catch {
        histories = [];
      }
    }

    if (!Array.isArray(histories)) {
      histories = [histories];
    }

    console.log(`[RateService] Found ${histories.length} history entries`);

    const normalizedTargetHistoryId = String(targetHistoryId || '').trim();
    const targetDateStr = String(date || '').trim();
    const targetServiceStr = String(service || '').trim().toLowerCase();
    const targetStaffStr = String(staff || '').trim().toLowerCase();

    let matchIndex = -1;

    if (normalizedTargetHistoryId) {
      for (let i = 0; i < histories.length; i++) {
        const item = histories[i] || {};
        const itemHistoryId = String(item.id || item.historyId || '').trim();

        console.log(`[RateService] Checking history[${i}] by id: historyId="${itemHistoryId}"`);

        if (itemHistoryId === normalizedTargetHistoryId) {
          console.log(`[RateService] Found matching history by id at index ${i}`);
          matchIndex = i;
          break;
        }
      }
    }

    if (matchIndex === -1) {
      for (let i = 0; i < histories.length; i++) {
        const item = histories[i] || {};
        const itemDateStr = String(item.date || '').trim();
        const itemServiceStr = String(item.service || '').trim().toLowerCase();
        const itemStaffStr = String(item.staff || '').trim().toLowerCase();

        console.log(`[RateService] Checking history[${i}]: date="${itemDateStr}", service="${itemServiceStr}", staff="${itemStaffStr}"`);

        if (itemDateStr === targetDateStr && itemServiceStr === targetServiceStr && itemStaffStr === targetStaffStr) {
          console.log(`[RateService] Found matching history at index ${i}`);
          matchIndex = i;
          break;
        }
      }
    }

    if (matchIndex === -1) {
      console.error('[RateService] No matching history entry found');
      return res.status(404).json({ error: 'Service history entry not found' });
    }

    console.log('[RateService] Step 3: Updating history entry with rating');
    histories[matchIndex] = {
      ...histories[matchIndex],
      rating: parseInt(rating),
      rated: true,
      rated_at: new Date().toISOString(),
    };

    console.log('[RateService] Updated history entry:', histories[matchIndex]);

    console.log('[RateService] Step 4: Saving updated histories to database');
    const { error: updateError } = await supabase
      .from('customers_accounts')
      .update({ histories })
      .eq('id', customerId);

    if (updateError) {
      console.error('[RateService] Update error:', updateError);
      return res.status(500).json({ error: 'Failed to save rating', details: updateError.message });
    }

    console.log('[RateService] ✓ Rating saved successfully');
    res.status(200).json({
      success: true,
      message: 'Rating saved successfully',
      data: {
        customerId,
        rating,
        entry: histories[matchIndex],
      },
    });
  } catch (err) {
    console.error('[RateService] Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
