import { getSupabaseClient } from './utils/supabaseClient.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, contact, stylist, services = [], refNo } = req.body || {};

    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required' });
    }

    const supabase = getSupabaseClient();
    const today = new Date().toISOString().split('T')[0];
    const assignedStaff = typeof stylist === 'object' ? stylist?.name || stylist?.label || null : stylist || null;

    const walkInData = {
      date: today,
      availability: false,
      customer_name: String(name).trim(),
      customer_contact: contact ? String(contact).trim() : null,
      assigned_staff: assignedStaff,
      services,
      status: 'pending',
      updated_at: new Date().toISOString(),
    };

    console.log('[WalkInCreate] Inserting walk-in:', walkInData, 'client ref:', refNo || null);

    const { data, error } = await supabase
      .from('walk_in_logs')
      .insert(walkInData)
      .select('id, date, customer_name, customer_contact, assigned_staff, services, status, created_at, updated_at');

    if (error) {
      console.error('[WalkInCreate] Supabase insert error:', error.message);
      return res.status(400).json({
        success: false,
        message: 'Failed to insert walk-in data',
        details: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Walk-in logged successfully',
      data: data || [],
    });
  } catch (error) {
    console.error('[WalkInCreate] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error creating walk-in log',
      error: error.message,
    });
  }
}